exports.up = function(knex) {
	return knex.schema.createTable("users_campaigns", table => {
		table.increments("id").primary();
		table.timestamp("created_at").defaultTo(knex.fn.now());
		table
			.integer("userId")
			.unsigned()
			.references("id")
			.inTable("users")
			.onDelete("CASCADE")
			.index();
		table
			.integer("campaignId")
			.unsigned()
			.references("id")
			.inTable("campaigns")
			.onDelete("CASCADE")
			.index();
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists("users_campaigns");
};
