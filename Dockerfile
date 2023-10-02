FROM node

WORKDIR /back/

COPY ./package.json /back/

RUN yarn install

COPY . /back/

RUN yarn add bcrypt

CMD yarn start:dev