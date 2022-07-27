# Common build stage
FROM node:16.14.2

COPY . ./app

WORKDIR /app

RUN npm install

EXPOSE 3000

ENV NODE_ENV production

CMD ["npm", "run", "start"]
