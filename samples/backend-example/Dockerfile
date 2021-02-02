FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./


RUN npm ci

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]