#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
go test -mod=readonly ./pkg/mb3server -run '^TestPrimaryFixtures$' -count=1
namespace=${MASSBANK_TEST_NAMESPACE:-massbank-dev}
name="primary-test-$(openssl rand -hex 6)"
temporary=$(mktemp -d)
forward_pid=""
k=(kubectl --namespace "$namespace")

cleanup() {
    result=$?
    trap - EXIT
    if (( result != 0 )); then
        "${k[@]}" logs "pod/$name" --all-containers || true
        "${k[@]}" logs "job/$name-import" --all-containers || true
    fi
    if [[ -n "$forward_pid" ]]; then
        kill "$forward_pid" 2>/dev/null || true
        wait "$forward_pid" 2>/dev/null || true
    fi
    if ! "${k[@]}" delete "job/$name-import" "pod/$name" "service/$name" \
        "configmap/$name-fixtures" "configmap/$name-init" "secret/$name" \
        --ignore-not-found --wait=true --timeout=120s; then
        echo "Test resource cleanup failed for $name in namespace $namespace." >&2
        result=1
    fi
    rm -f "$temporary/password" "$temporary/forward.log"
    rmdir "$temporary"
    exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

umask 077
password=$(openssl rand -hex 24)
printf '%s' "$password" > "$temporary/password"
"${k[@]}" create secret generic "$name" --from-file=password="$temporary/password"
"${k[@]}" create configmap "$name-fixtures" \
    --from-file=records.tar.gz=pkg/mb3server/testdata/primary/records.tar.gz
"${k[@]}" create configmap "$name-init" \
    --from-file=000_bingo_install.sh=compose/initdb.d/000_bingo_install.sh \
    --from-file=001_bingo_config.sh=compose/initdb.d/00_init_ALLOW_NON_UNIQUE_DEAROMATIZATION.sh
"${k[@]}" create -f - <<YAML
apiVersion: v1
kind: Pod
metadata:
  name: $name
  labels:
    primary-test: $name
spec:
  restartPolicy: Never
  initContainers:
    - name: bingo
      image: quay.io/massbank/postgres-bingo-init:v17-bingo-1.45.0
      command: ["/bin/sh", "-c", "cp -rp /bingo-postgres/. /opt/bingo-postgres/"]
      volumeMounts:
        - {name: bingo, mountPath: /opt/bingo-postgres}
  containers:
    - name: postgres
      image: postgres:17.11
      env:
        - {name: POSTGRES_DB, value: massbank_primary_test}
        - {name: POSTGRES_USER, value: massbank}
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef: {name: $name, key: password}
      readinessProbe:
        exec:
          command: ["pg_isready", "-h", "127.0.0.1", "-U", "massbank", "-d", "massbank_primary_test"]
        periodSeconds: 2
      resources:
        requests: {cpu: 100m, memory: 256Mi}
        limits: {cpu: "2", memory: 1Gi}
      volumeMounts:
        - {name: postgres, mountPath: /var/lib/postgresql/data}
        - {name: bingo, mountPath: /opt/bingo-postgres, readOnly: true}
        - {name: init, mountPath: /docker-entrypoint-initdb.d, readOnly: true}
  volumes:
    - {name: postgres, emptyDir: {}}
    - {name: bingo, emptyDir: {}}
    - name: init
      configMap: {name: $name-init}
---
apiVersion: v1
kind: Service
metadata:
  name: $name
spec:
  selector:
    primary-test: $name
  ports:
    - {port: 5432, targetPort: 5432}
YAML
"${k[@]}" wait --for=condition=Ready "pod/$name" --timeout=300s
"${k[@]}" create -f - <<YAML
apiVersion: batch/v1
kind: Job
metadata:
  name: $name-import
spec:
  backoffLimit: 0
  activeDeadlineSeconds: 900
  template:
    spec:
      restartPolicy: Never
      initContainers:
        - name: fixtures
          image: alpine:3.22
          command: ["tar", "-xzf", "/fixtures/records.tar.gz", "-C", "/data"]
          volumeMounts:
            - {name: fixtures, mountPath: /fixtures, readOnly: true}
            - {name: data, mountPath: /data}
      containers:
        - name: importer
          image: quay.io/massbank/massbank-export-api:test-shared-jpa-e4c04ef9b490114b2780c1c75ef146b5c242ba54
          command: ["java", "-Xmx1200m", "-jar", "/app-import.jar"]
          env:
            - {name: DB_HOST, value: $name}
            - {name: DB_PORT, value: "5432"}
            - {name: DB_NAME, value: massbank_primary_test}
            - {name: DB_USER, value: massbank}
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef: {name: $name, key: password}
            - {name: MB_SHARED_DATABASE, value: "true"}
            - {name: MB_DATA_DIRECTORY, value: /data}
            - {name: MB_DATA_VERSION, value: primary-regression-2026.03}
          resources:
            requests: {cpu: 500m, memory: 512Mi}
            limits: {cpu: "2", memory: 2Gi}
          volumeMounts:
            - {name: data, mountPath: /data, readOnly: true}
      volumes:
        - {name: data, emptyDir: {}}
        - name: fixtures
          configMap: {name: $name-fixtures}
YAML
"${k[@]}" wait --for=condition=complete "job/$name-import" --timeout=920s
"${k[@]}" port-forward "pod/$name" :5432 > "$temporary/forward.log" 2>&1 &
forward_pid=$!
port=""
for _ in {1..60}; do
    port=$(sed -n 's/^Forwarding from 127.0.0.1:\([0-9]*\) -> 5432$/\1/p' "$temporary/forward.log" | head -n 1)
    if [[ -n "$port" ]]; then break; fi
    if ! kill -0 "$forward_pid" 2>/dev/null; then
        cat "$temporary/forward.log" >&2
        exit 1
    fi
    sleep 1
done
if [[ -z "$port" ]]; then
    echo "PostgreSQL port-forward did not become ready." >&2
    exit 1
fi
export MASSBANK_SHARED_TEST_DSN="postgres://massbank:$password@127.0.0.1:$port/massbank_primary_test?sslmode=disable"
export MASSBANK_PRIMARY_TEST_DSN="$MASSBANK_SHARED_TEST_DSN"
export MASSBANK_PRIMARY_TEST_REQUIRED=true
go test -mod=readonly -race -count=1 -timeout=10m ./pkg/...
