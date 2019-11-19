exports.up = function(knex) {
  return knex.schema.createTable("userActions", table => {
    table.increments("id").primary();
    table
      .integer("userId")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .index();
    table
      .integer("actionId")
      .unsigned()
      .references("id")
      .inTable("actions")
      .onDelete("SET NULL")
      .index();
    table
      .integer("campaignId")
      .unsigned()
      .references("id")
      .inTable("campaigns")
      .onDelete("SET NULL")
      .index();
    table.boolean("completed");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("users_actions");
};
