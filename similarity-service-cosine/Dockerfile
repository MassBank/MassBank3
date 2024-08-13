FROM eclipse-temurin:17-jre

COPY generate.sh openapi-generator-cli.jar openapi.yaml /usr/src/app/

WORKDIR /usr/src/app
RUN bash generate.sh

FROM python:3.12-slim-bookworm
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt /usr/src/app/
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt

COPY cosine_impl /usr/src/app/cosine_impl
COPY --from=0 /usr/src/app/openapi.yaml /usr/src/app/openapi.yaml
COPY --from=0 /usr/src/app/gen /usr/src/app/gen

ENV PYTHONPATH=/usr/src/app/gen

EXPOSE 8080/tcp
ENTRYPOINT ["/usr/local/bin/waitress-serve"]
CMD ["--port=8080", "cosine_impl.app:app"]