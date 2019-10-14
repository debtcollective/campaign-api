exports.up = function(knex) {
	return knex.schema.createTable("users_actions", table => {
		table.increments("id").primary();
		table
			.integer("userId")
			.unsigned()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
			.index();
		table
			.integer("actionId")
			.unsigned()
			.references("id")
			.inTable("actions")
			.onDelete("CASCADE")
			.index();
		table.boolean("completed");
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("users_actions");
};
