FROM node:12.17.0-alpine3.9

ENV APP_PATH /opt/darwin-deploy

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

RUN wget -q -O - https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | /bin/sh

RUN helm version

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH
COPY . $APP_PATH

RUN npm ci
RUN npm run build

ENV NODE_OPTIONS --enable-source-maps

ENTRYPOINT node dist/main.js
