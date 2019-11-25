exports.up = function (knex) {
  return knex.schema.table('user_actions', function (table) {
    table.jsonb('data').defaultTo({})
  })
}

exports.down = function (knex) {
  return knex.schema.table('user_actions', function (table) {
    table.dropColumn('user_actions')
  })
}
