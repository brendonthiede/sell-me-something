# syntax=docker/dockerfile:1
FROM nginx:1.25

COPY ./docs /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html
COPY ./docker/files/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80