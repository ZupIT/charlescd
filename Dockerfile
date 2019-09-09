FROM node:8-alpine

ENV APP_PATH /opt/darwin-deploy

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD package.json $APP_PATH
RUN npm install

RUN npm run build

ADD ./dist $APP_PATH

ENTRYPOINT node main.js
