FROM nginx@sha256:36f3464a21975e5779d081a9e8a78a024c549d1895fc9981d6bd8b67075ebd7b

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY build .

COPY .env .

COPY env-writer.js .

RUN apk add --update nodejs

CMD ["/bin/sh", "-c", "node env-writer.js && nginx -g \"daemon off;\""]
