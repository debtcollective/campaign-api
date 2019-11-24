exports.up = function(knex) {
  return knex.schema.createTable('user_actions', table => {
    table.increments('id').primary()
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .index()
    table
      .integer('action_id')
      .unsigned()
      .references('id')
      .inTable('actions')
      .onDelete('SET NULL')
      .index()
    table
      .integer('campaign_id')
      .unsigned()
      .references('id')
      .inTable('campaigns')
      .onDelete('SET NULL')
      .index()
    table.boolean('completed')
    table.timestamps(false, true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users_actions')
}
