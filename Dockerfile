FROM node:8-alpine

ENV APP_PATH /opt/darwin-deploy

RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD package.json $APP_PATH
RUN npm install

ADD . $APP_PATH

RUN npm run build

CMD npm run start:prod