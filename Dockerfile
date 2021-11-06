FROM node:14-alpine

WORKDIR /app

COPY . .

RUN ["yarn", "install"]

EXPOSE 3001
ENTRYPOINT ["yarn", "run", "start"]