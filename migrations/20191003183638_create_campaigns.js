exports.up = function(knex) {
  return knex.schema.createTable("campaigns", table => {
    table.increments("id").primary();
    table.string("slug");
    table.string("name");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("campaigns");
};
