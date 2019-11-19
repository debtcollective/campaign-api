exports.up = function (knex) {
  return knex.schema.createTable('actions', table => {
    table.increments('id').primary()
    table
      .integer('campaignId')
      .unsigned()
      .references('id')
      .inTable('campaigns')
      .onDelete('SET NULL')
      .index()
    // A short sentence saying what's the action
    table.string('title')
    // A more detail explanaiton about why's and how to do the action
    table.string('description')
    // A way to categorize the action with UI proposes
    table.string('type')
    // A set of arguments needed to built the UI approperly
    table.jsonb('config')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('actions')
}
