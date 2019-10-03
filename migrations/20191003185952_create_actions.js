exports.up = function(knex) {
	return knex.schema.createTable("actions", table => {
		table.increments("id").primary();
		table.string("title");
		table.string("description");
		table.enu("verification", ["NONE"]);
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("actions");
};
