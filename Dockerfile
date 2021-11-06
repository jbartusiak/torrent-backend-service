FROM alpine:latest AS builder
RUN apk update
RUN apk add nodejs yarn
WORKDIR /app
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

CMD ["node", "build/index.js"]

EXPOSE 3001