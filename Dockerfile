FROM node:lts-alpine

WORKDIR /server

COPY . .

RUN npm install

EXPOSE 8006

CMD [ "node", "server.js" ]