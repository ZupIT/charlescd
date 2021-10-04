FROM node@sha256:be1c8c7f0b61e86c4ee94b12d18a810fedfc2a29d4d0ef0ce1ff89c1f2efca11

ENV APP_PATH /opt/0311-040-script

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD migration.js $APP_PATH
ADD package.json $APP_PATH

RUN npm install

ENTRYPOINT node migration.js
