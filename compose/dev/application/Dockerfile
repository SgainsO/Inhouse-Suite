FROM node:20

WORKDIR /app

COPY ./Application/package*.json /app
RUN npm install && npm cache clean --force

ENV PATH=./node_modules/.bin/:$PATH

CMD ["npm", "run", "dev"]
