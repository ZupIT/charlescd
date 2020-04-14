FROM nginx:1.15.2-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY dist .

COPY .env .

COPY env-writer.js .

RUN apk add --update nodejs

CMD ["/bin/sh", "-c", "node env-writer.js && nginx -g \"daemon off;\""]