FROM node:12.10.0

WORKDIR /usr/src/app

ADD ./package.json package.json
RUN yarn install

COPY . .

# Copy knexfile.js
COPY knexfile.template.js knexfile.js

EXPOSE 4000

CMD ["yarn", "start"]
