FROM node@sha256:b8b2ec226188685f9c3215e9b7614103829ada92bb5b107638a166dd1fac2677

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