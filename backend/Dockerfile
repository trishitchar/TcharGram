FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20

WORKDIR /usr/src/app

COPY --from=build /usr/src/app ./

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]