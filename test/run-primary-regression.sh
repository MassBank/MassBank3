#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
docker compose version >/dev/null
go test -mod=readonly ./pkg/mb3server -run '^TestPrimaryFixtures$' -count=1

export PRIMARY_TEST_PASSWORD
PRIMARY_TEST_PASSWORD=$(openssl rand -hex 24)
export PRIMARY_TEST_DATA
PRIMARY_TEST_DATA=$(mktemp -d)
project="massbank-primary-test-$(openssl rand -hex 6)"
compose=(docker compose --project-name "$project" -f test/compose.yaml)

cleanup() {
    result=$?
    trap - EXIT
    if (( result != 0 )); then
        "${compose[@]}" logs --no-color || true
    fi
    if ! "${compose[@]}" down --volumes --remove-orphans; then
        echo "Could not remove test project $project; run docker compose down for this project." >&2
        result=1
    fi
    find "$PRIMARY_TEST_DATA" -type f -name 'MSBNK-*.txt' -delete
    find "$PRIMARY_TEST_DATA" -depth -type d -empty -delete
    exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

tar -xzf pkg/mb3server/testdata/primary/records.tar.gz -C "$PRIMARY_TEST_DATA"
"${compose[@]}" run --rm tests
