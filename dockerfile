FROM node:14

WORKDIR /root/app
COPY package.json .

RUN yarn
COPY . .

RUN yarn build
EXPOSE 3001
CMD ["yarn", "start"]
