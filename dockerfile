FROM node:alpine

WORKDIR /root/app
COPY package.json .

RUN yarn
COPY . .

RUN yarn build
EXPOSE 3002
CMD ["yarn", "start"]
