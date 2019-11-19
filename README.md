# Campaign API 👋

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](#)
[![Twitter: 0debtzone](https://img.shields.io/twitter/follow/0debtzone.svg?style=social)](https://twitter.com/0debtzone)

> This service makes relations between users and campaigns of your organizations, those campaigns have actions that help to promote the awareness of your initiatives.

## Dependencies

These are the apps you will need to have installed in order to run this app.

- [PostgreSQL](https://www.postgresql.org/).

## Install

### Knexfile

Run the command below to init the database configuration.

```sh
cp knexfile.template.js knexfile.js
```

You will need to modify variables to fit your environment, more importantly the `user` and `superuser` fields

### Packages

Run the command below to install the packages for this app.

```sh
yarn install
```

## Usage

Runs the service that expose a GraphQL endpoint.

```sh
yarn start
```

> NOTE: If you need to have some data for testing/development proposes you may want to take a look to models/stubs/development.seed.js file in order to populate your development database with some data

### Running with Docker

You can use `docker-compose` to run the project with Docker if you prefer that, or to test that the image is building correctly.

```sh
docker-compose up
```

To create database and run migrations run in another terminal

```sh
docker-compose run --rm app yarn db:create
docker-compose run --rm app yarn db:migrate
```

## Run tests

In order to being able to run this you have to:

1. Create a database called "campaign_api_test". You can do this by running `NODE_ENV=test yarn db:create`
2. Migrate the database running `NODE_ENV=test yarn db:migrate`
3. Run the tests with `yarn test` or with coverage running `yarn test:ci`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/duranmla"><img src="https://avatars2.githubusercontent.com/u/1425162?v=4" width="100px;" alt="Alexis Duran"/><br /><sub><b>Alexis Duran</b></sub></a><br /><a href="#infra-duranmla" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/duranmla/social-giveaways/commits?author=duranmla" title="Tests">⚠️</a> <a href="https://github.com/duranmla/social-giveaways/commits?author=duranmla" title="Code">💻</a></td>
    <td align="center"><a href="https://www.orlandodelaguila.com"><img src="https://avatars3.githubusercontent.com/u/849872?v=4" width="100px;" alt="Orlando Del Aguila"/><br /><sub><b>Orlando Del Aguila</b></sub></a><br /><a href="#infra-orlando" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/duranmla/social-giveaways/commits?author=orlando" title="Tests">⚠️</a> <a href="https://github.com/duranmla/social-giveaways/commits?author=orlando" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
