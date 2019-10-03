exports.up = function(knex) {
	return knex.schema.createTable("campaigns_actions", table => {
		table.increments("id").primary();
		table
			.integer("actionId")
			.unsigned()
			.references("id")
			.inTable("actions")
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
	return knex.schema.dropTableIfExists("campaigns_actions");
};
