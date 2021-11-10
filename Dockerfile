FROM node:16

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT exec npm start

EXPOSE 3000