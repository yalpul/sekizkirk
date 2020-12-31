FROM node:12-alpine
WORKDIR /rendererapp
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
