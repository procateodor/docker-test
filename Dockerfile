FROM node:10.15.3-alpine AS base
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm", "run", "dev" ]