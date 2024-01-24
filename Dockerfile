FROM denoland/deno:latest

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app

COPY . .
RUN deno cache main.ts

EXPOSE 4000

CMD ["run", "-A", "--allow-net", "--allow-env", "--allow-read", "main.ts", "--import-map=import_map.json"]