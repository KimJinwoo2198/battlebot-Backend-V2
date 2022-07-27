# Common build stage
FROM node:16.14.2

COPY . ./app

WORKDIR /app

RUN yarn

EXPOSE 3001

ENV NODE_ENV production

CMD ["yarn", "start"]
