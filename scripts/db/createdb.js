#! /usr/bin/env node

(async function() {
	try {
		const {
			dbManager: dbManagerConfig,
			...knex
		} = require("../../knexfile.js");
		const dbManager = require("knex-db-manager").databaseManagerFactory({
			knex,
			dbManager: dbManagerConfig
		});

		await dbManager.createDb();
	} catch (e) {
		console.log(e);
	} finally {
		process.exit();
	}
})();
