FROM node:18 AS build
WORKDIR /app
COPY . .
COPY .env .env
RUN npm install
RUN npm run build