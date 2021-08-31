FROM nginx@sha256:d85914d547a6c92faa39ce7058bd7529baacab7e0cd4255442b04577c4d1f424

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY build .

COPY .env .

COPY env-writer.js .

RUN apk add --update nodejs

CMD ["/bin/sh", "-c", "node env-writer.js && nginx -g \"daemon off;\""]
