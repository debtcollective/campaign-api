#! /usr/bin/env node

(async function () {
  try {
    const {
      dbManager: dbManagerConfig,
      ...knex
    } = require('../../knexfile.js')
    const dbManager = require('knex-db-manager').databaseManagerFactory({
      knex,
      dbManager: dbManagerConfig
    })

    await dbManager.dropDb()
  } catch (e) {
    console.log(e)
  } finally {
    process.exit()
  }
})()
