FROM nginx@sha256:23e4dacbc60479fa7f23b3b8e18aad41bd8445706d0538b25ba1d575a6e2410b

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY build .

COPY .env .

COPY env-writer.js .

RUN apk add --update nodejs

CMD ["/bin/sh", "-c", "node env-writer.js && nginx -g \"daemon off;\""]
