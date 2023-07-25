FROM node:latest

EXPOSE 1337

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

CMD [ "node", "dist/main.js" ]
