FROM nginx@sha256:c82521676580c4850bb8f0d72e47390a50d60c8ffe44d623ce57be521bca9869

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY build .

COPY .env .

COPY env-writer.js .

RUN apk add --update nodejs

CMD ["/bin/sh", "-c", "node env-writer.js && nginx -g \"daemon off;\""]
