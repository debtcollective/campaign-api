exports.up = function (knex, Promise) {
  return knex.schema.table('users', function (t) {
    t.integer('external_id')
    t.string('username')
    t.string('avatar_url')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users', function (t) {
    t.dropColumn('external_id')
    t.dropColumn('username')
    t.string('avatar_url')
  })
}
