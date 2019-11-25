exports.up = function(knex) {
  return knex.schema.createTable('users_campaigns', table => {
    table.increments('id').primary()
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index()
    table
      .integer('campaign_id')
      .unsigned()
      .references('id')
      .inTable('campaigns')
      .onDelete('CASCADE')
      .index()
    table.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_campaigns')
}
