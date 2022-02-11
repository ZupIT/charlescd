FROM node@sha256:a0590a265b222387d756ba357c4a9875778f1a7638ac011f3fb4942d3b7ae5c0

ENV APP_PATH /opt/0311-040-script

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD migration.js $APP_PATH
ADD package.json $APP_PATH

RUN npm install

ENTRYPOINT node migration.js
