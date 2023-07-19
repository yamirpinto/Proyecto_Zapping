FROM mysql:8.0

ENV MYSQL_DATABASE dbpruebazap
ENV MYSQL_ROOT_PASSWORD admin

ADD setup.sql /docker-entrypoint-initdb.d/
