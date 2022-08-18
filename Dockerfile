# syntax=docker/dockerfile:1
FROM denoland/deno:latest as base
WORKDIR /app
COPY . ./
RUN deno cache server.ts

CMD ["run", "--allow-env", "--allow-read", "--allow-net", "server.ts"]