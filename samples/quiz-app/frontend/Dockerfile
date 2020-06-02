FROM node:12.17.0-alpine3.11 as builder
RUN mkdir /opt/quiz
WORKDIR /opt/quiz
COPY . .
RUN yarn install && yarn build

FROM nginx:1.15.2-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /opt/quiz/build/ .