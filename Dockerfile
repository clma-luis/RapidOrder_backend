FROM node:21-alpine

WORKDIR /home/app

COPY package*.json ./

COPY package.json .
RUN npm install --quiet

#RUN npm install -g typescript

COPY . .

EXPOSE 8080

CMD ["npm", "start"]