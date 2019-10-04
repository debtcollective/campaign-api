module.exports = {
	testing: {
		client: "postgresql",
		connection: {
			database: "social-giveaways-service-testing"
		},
		pool: {
			min: 2,
			max: 10
		}
	},

	development: {
		client: "postgresql",
		connection: {
			database: "social-giveaways-service-development"
		},
		pool: {
			min: 2,
			max: 10
		}
	},

	production: {
		client: "postgresql",
		connection: {
			database: "social-giveaways-service"
		},
		pool: {
			min: 2,
			max: 10
		}
	}
};
