FROM node:22-alpine

COPY ./docker/entrypoint.sh /docker-entrypoint.d/entrypoint.sh

RUN chmod -R +x /docker-entrypoint.d/

WORKDIR /usr/src/app

ENTRYPOINT ["/bin/sh", "docker/entrypoint.sh"]

CMD ["npm", "run", "start"]
