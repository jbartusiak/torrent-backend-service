FROM alpine

RUN apk add --update nodejs npm

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "build/index.js"]

EXPOSE 3001
