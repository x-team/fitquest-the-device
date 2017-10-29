FROM node:8

VOLUME [".:/home/app/code"]

WORKDIR /home/app/code

RUN npm install

EXPOSE 8888

ENTRYPOINT ["node", "lib/index.js"]
