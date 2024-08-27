FROM node:20.11.1 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install rimraf

RUN npm install --only=dev

COPY . .

CMD ["npm", "run", "start:dev"]