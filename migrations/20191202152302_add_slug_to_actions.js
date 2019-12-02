exports.up = function (knex) {
  return knex.schema.table('actions', function (t) {
    t.string('slug').notNull()
    t.unique(['campaign_id', 'slug']) // slugs are unique in a campaign
  })
}

exports.down = function (knex) {
  return knex.schema.table('actions', function (t) {
    t.dropUnique(['campaign_id', 'slug'])
    t.dropColumn('slug')
  })
}
