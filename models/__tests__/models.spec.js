const Knex = require("knex");
const knexConfig = require("../../knexfile");
const { Model } = require("objection");
const faker = require("faker");

const { Action } = require("../../models/Action");
const { Campaign } = require("../../models/Campaign");
const { User } = require("../../models/User");

/**
 * In order to being able to run this you have to
 *  1. create a psql database called as `knexfile.testing` suggests
 *  2. npx knex migrate:latest --env="testing"
 */

const knex = Knex(knexConfig.testing);
Model.knex(knex);

beforeAll(async () => {
	await User.query().delete();
	await Action.query().delete();
	await Campaign.query().delete();
});

afterAll(async () => {
	await User.query().delete();
	await Action.query().delete();
	await Campaign.query().delete();
});

const stubs = {
	user: () => ({
		email: faker.internet.email()
	}),
	campaign: () => ({
		name: faker.lorem.words(2),
		slug: faker.lorem
			.words(2)
			.toLowerCase()
			.split(" ")
			.join("-")
	}),
	actions: () => [
		{
			title: faker.lorem.words(2),
			description: faker.lorem.words(10),
			verification: "NONE"
		}
	]
};

describe("model structure", () => {
	it("allows to insert actions related to a campaign", async () => {
		const campaign = await Campaign.query().insert(stubs.campaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(stubs.actions());

		expect(campaign.id).toBeTruthy();
		expect(actions[0].id).toBeTruthy();
	});

	it("allows to insert campaigns related to a user", async () => {
		const user = await User.query().insert(stubs.user());
		const campaign = await user
			.$relatedQuery("campaign")
			.insert(stubs.campaign());

		expect(campaign.id).toBeTruthy();
	});

	it("allows to query actions by user", async () => {
		const user = await User.query().insert(stubs.user());
		const campaign = await user
			.$relatedQuery("campaign")
			.insert(stubs.campaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(stubs.actions());

		expect(user.id).toBeTruthy();
		expect(campaign.id).toBeTruthy();
		expect(actions.length).toBeGreaterThan(0);
	});
});
