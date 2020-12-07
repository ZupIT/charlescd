FROM node:12.17.0-alpine3.9

ENV NODE_ENV qa

ENV CONSUL_HOST consul-server

ENV APP_PATH /opt/darwin-deploy

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*

RUN wget -q -O - https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 | /bin/sh

RUN helm version

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD package.json $APP_PATH
RUN npm install

ADD ./dist $APP_PATH

ENTRYPOINT node main.js
