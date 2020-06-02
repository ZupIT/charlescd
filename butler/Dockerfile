FROM node:12-alpine

ENV NODE_ENV qa

ENV CONSUL_HOST consul-server

ENV APP_PATH /opt/darwin-deploy

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD package.json $APP_PATH
RUN npm install

ADD ./dist $APP_PATH

ENTRYPOINT node main.js
