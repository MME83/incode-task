FROM node:16.18.0-alpine

WORKDIR /usr/mme83-app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]