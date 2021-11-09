FROM node:14-slim AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

FROM node:14-slim AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json .
COPY --from=builder /app/.env .
COPY --from=builder /app/docker-entrypoint.sh .

ENTRYPOINT ["/bin/sh", "docker-entrypoint.sh"]

EXPOSE 3001