FROM alpine:latest AS builder
RUN apk add --update nodejs npm
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install
RUN npm run build

FROM alpine:latest AS runner
RUN apk add --update nodejs npm
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .

CMD ["node", "build/index.js"]

EXPOSE 3001
