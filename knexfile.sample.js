module.exports = {
	client: "postgresql",
	connection: process.env.DB_CONNECTION_STRING || {
		host: process.env.DB_HOST || "localhost",
		user: process.env.DB_USER || "postgres",
		password: process.env.DB_PASS || "",
		database:
      process.env.DB_NAME ||
      `campaign_api_${process.env.NODE_ENV || "development"}`
	},
	pool: {
		min: process.env.DB_POOL_MIN || 2,
		max: process.env.DB_POOL_MAX || 10
	},
	migrations: {
		tableName: process.env.DB_MIGRATIONS_TABLE || "knex_migrations"
	},
	// dbManager is used on development and test envs only
	dbManager: {
		collate: ["en_US.UTF-8"],
		superUser: process.env.DB_USER || "postgres",
		superPassword: process.env.DB_PASS || ""
	}
};
