FROM node:17-slim AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

FROM node:17-slim AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env .

CMD ["node", "build/index.js"]

EXPOSE 3001