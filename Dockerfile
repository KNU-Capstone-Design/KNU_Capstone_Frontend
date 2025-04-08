FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build