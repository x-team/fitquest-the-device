FROM node:8

VOLUME [".:/home/app/code"]

WORKDIR /home/app/code

RUN npm install

ENTRYPOINT ["node", "lib/index.js"]
