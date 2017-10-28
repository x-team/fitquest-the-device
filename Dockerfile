FROM node:8

WORKDIR /home/app/code

RUN npm install

EXPOSE 8888

VOLUME [".:/home/app/code"]

ENTRYPOINT ["node", "lib/index.js"]
