# build
FROM node:18-alpine as build

WORKDIR /back

COPY ./package.json ./

RUN yarn install

COPY . .

RUN yarn build

#production
FROM node:18-alpine as production

COPY --from=build ./back/dist ./dist
COPY --from=build ./back/package.json ./
COPY --from=build ./back/yarn.lock  ./

RUN yarn install --production

CMD ["yarn", "start:prod"]