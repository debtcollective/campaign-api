const Knex = require("knex");
const knexConfig = require("../../knexfile");
const { Model } = require("objection");

const { Action } = require("../../models/Action");
const { Campaign } = require("../../models/Campaign");
const { User } = require("../../models/User");
const { createActions, createCampaign, createUser } = require("../stubs");

/**
 * In order to being able to run this you have to
 *  1. create a psql database called as `knexfile.testing` suggests
 *  2. npx knex migrate:latest --env="testing"
 *
 * NOTE: by running `yarn test` it should do the trick but you need for the very first
 * time to create the database yourself
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

describe("model structure", () => {
	it("allows to insert actions related to a campaign", async () => {
		const campaign = await Campaign.query().insert(createCampaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(createActions());

		expect(campaign.id).toBeTruthy();
		expect(actions[0].id).toBeTruthy();
	});

	it("allows to insert campaigns related to a user", async () => {
		const user = await User.query().insert(createUser());
		const campaign = await user
			.$relatedQuery("campaign")
			.insert(createCampaign());

		expect(campaign.id).toBeTruthy();
	});

	it("allows to query actions by user", async () => {
		const user = await User.query().insert(createUser());
		const campaign = await user
			.$relatedQuery("campaign")
			.insert(createCampaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(createActions());

		expect(user.id).toBeTruthy();
		expect(campaign.id).toBeTruthy();
		expect(actions.length).toBeGreaterThan(0);
	});
});
