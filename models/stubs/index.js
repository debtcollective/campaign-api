const faker = require("faker");

module.exports = {
	createUser: () => ({
		email: faker.internet.email()
	}),
	createCampaign: () => ({
		name: faker.lorem.words(2),
		slug: faker.lorem
			.words(2)
			.toLowerCase()
			.split(" ")
			.join("-")
	}),
	createActions: () => [
		{
			title: faker.lorem.words(2),
			description: faker.lorem.words(10),
			verification: "NONE"
		},
		{
			title: faker.lorem.words(2),
			description: faker.lorem.words(10),
			verification: "NONE"
		}
	]
};
