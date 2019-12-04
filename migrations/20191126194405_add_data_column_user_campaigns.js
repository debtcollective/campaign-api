exports.up = function (knex, Promise) {
  return knex.schema
    .table('users_campaigns', function (t) {
      t.jsonb('data').default({})
    })
    .raw("CREATE INDEX on ?? ((??#>>'{motive}'))", ['users_campaigns', 'data'])
}

exports.down = function (knex, Promise) {
  return knex.schema.table('users_campaigns', function (t) {
    t.dropColumn('data')
  })
}
