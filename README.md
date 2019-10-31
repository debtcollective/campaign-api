<h1 align="center">Welcome to social-giveaways-service 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
  <a href="https://twitter.com/0debtzone" target="_blank">
    <img alt="Twitter: 0debtzone" src="https://img.shields.io/twitter/follow/0debtzone.svg?style=social" />
  </a>
</p>

> This service intends to be able to make relations between users and campaigns of your organizations, those campaigns have actions that help to promote the awareness of your initiatives

## Pre-requisites

You need to have postgresql in your machine, this project expect you to have two databases one for development and another to test environment check [knexfile.js](knexfile.js) to check the databases name.

If you don't have postgresql installed or/and you don't know how to create a database you can refer to [this blog post](https://www.codementor.io/engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb) that can help you to setup everything up.

## Install

```sh
yarn install
```

## Usage

Runs the service that expose a GraphQL endpoint.

```sh
yarn start
```

## Run tests

The tests drop the current database for testing *(so you need to have even a empty database of testing created)* and create a new one to be populated with the fake data to make the assertions.

```sh
yarn test
```

## Author

👤 **debtcollective**

* Twitter: [@0debtzone](https://twitter.com/0debtzone)
* Github: [@debtcollective](https://github.com/debtcollective)