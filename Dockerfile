FROM alpine:latest AS builder
RUN apk add --update nodejs yarn
WORKDIR /app
COPY package.json ./
COPY . .
RUN yarn install
RUN yarn run build

FROM alpine:latest AS runner
RUN apk add --update nodejs
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env .

ENTRYPOINT ["node", "build/index.js"]

EXPOSE 3001
