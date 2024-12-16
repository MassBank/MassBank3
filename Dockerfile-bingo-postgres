FROM postgres:15 as builder

# install tools (wget, unzip)
RUN apt-get update \
 && apt-get install -y --no-install-recommends wget unzip

RUN wget --no-check-certificate https://lifescience.opensource.epam.com/downloads/bingo-1.25.0/bingo-postgres-15-linux-x86_64.zip
RUN mkdir -p /opt/bingo-postgres
RUN unzip -p bingo-postgres-15-linux-x86_64.zip | tar -xzf- -C /opt/bingo-postgres --strip-components=1
WORKDIR /opt/bingo-postgres
RUN /bin/sh bingo-pg-install.sh -libdir /opt/bingo-postgres/lib -y

FROM postgres:15 as base
COPY --from=builder /opt/bingo-postgres/lib /opt/bingo-postgres/lib
COPY --from=builder /opt/bingo-postgres/bingo_install.sql /opt/bingo-postgres/init-scripts/000-bingo_install.sql
RUN sed -i '/docker_process_init_files \/docker-entrypoint-initdb.d\/*/i docker_process_init_files \/opt\/bingo-postgres\/init-scripts\/*' /usr/local/bin/docker-entrypoint.sh
