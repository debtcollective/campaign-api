exports.up = function(knex) {
	return knex.schema.createTable("users", table => {
		table.increments("id").primary();
		table.string("email");
		table
			.integer("campaignId")
			.unsigned()
			.references("id")
			.inTable("campaigns")
			.onDelete("SET NULL")
			.index();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("users");
};
