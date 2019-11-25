/**
 * Objection related code
 */
const Knex = require('knex')
const { Model, knexSnakeCaseMappers } = require('objection')

// Initialize knex.
// https://vincit.github.io/objection.js/recipes/snake-case-to-camel-case-conversion.html#snake-case-to-camel-case-conversion
const knexConfig = require('../knexfile')
const knex = Knex({
  ...knexConfig,
  ...knexSnakeCaseMappers()
})

Model.knex(knex)
module.exports = Model
