FROM node@sha256:a0590a265b222387d756ba357c4a9875778f1a7638ac011f3fb4942d3b7ae5c0

ENV APP_PATH /opt/darwin-deploy

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

ARG HELM_VERSION=v3.5.1

RUN wget -q -O - https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | /bin/sh -s -- --version $HELM_VERSION

RUN helm version

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH
COPY . $APP_PATH

RUN npm ci
RUN npm run build

ENV NODE_OPTIONS --enable-source-maps

ENTRYPOINT node dist/main.js
