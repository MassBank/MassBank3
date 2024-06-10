FROM python:3.11-bookworm
RUN apt update && apt install -y default-jre-headless

COPY generate.sh openapi-generator-cli.jar openapi.yaml /usr/src/app/

WORKDIR /usr/src/app
RUN bash generate.sh

FROM python:3.11-slim-bookworm
COPY requirements.txt /usr/src/app/
COPY cosine_impl /usr/src/app/cosine_impl
COPY --from=0 /usr/src/app/openapi.yaml /usr/src/app/openapi.yaml
COPY --from=0 /usr/src/app/gen /usr/src/app/gen

WORKDIR /usr/src/app
RUN pip3 install --no-cache-dir -r requirements.txt

ENV PYTHONPATH=/usr/src/app/gen

EXPOSE 8080

ENTRYPOINT ["python3"]

CMD ["-m", "cosine_impl"]