FROM node:13.14.0-alpine3.11

ENV APP_PATH /opt/0311-040-script

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD migration.js $APP_PATH
ADD package.json $APP_PATH

RUN npm install

ENTRYPOINT node migration.js
