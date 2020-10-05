FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# If you are building your code for production
# RUN npm ci --only=production
COPY . .
# Bundle app source
RUN npm run build



EXPOSE 3000
CMD [ "node", "lib/index.js" ]