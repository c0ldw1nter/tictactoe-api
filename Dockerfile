FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --save-dev mocha
RUN npm install --save-dev @babel/core @babel/cli

COPY . .

EXPOSE 3001

CMD [ "node", "app.js", "-e", "production" ]