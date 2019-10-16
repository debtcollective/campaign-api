const Knex = require("knex");
const knexConfig = require("../../knexfile");
const { Model } = require("objection");

const { Action } = require("../../models/Action");
const { Campaign } = require("../../models/Campaign");
const { User } = require("../../models/User");
const {
	createActions,
	createCampaign,
	createUser
} = require("../../models/stubs");
const { queryResolvers } = require("../");

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

const stubs = {};

beforeAll(async () => {
	await User.query().delete();
	await Action.query().delete();
	await Campaign.query().delete();

	// Create a user with campaign and actions
	const user = await User.query().insert(createUser());
	const campaignOne = await user
		.$relatedQuery("campaigns")
		.insert(createCampaign());
	await campaignOne.$relatedQuery("actions").insert(createActions());

	// Create a widow campaign
	const campaignTwo = await Campaign.query().insert(createCampaign());
	await campaignTwo.$relatedQuery("actions").insert(createActions());

	// Create a widow actions
	await Action.query().insert(createActions()[0]);

	stubs.campaigns = [campaignOne, campaignTwo];
});

describe("Query resolvers", () => {
	it("returns all campaigns with #campaigns method", async () => {
		const campaigns = await queryResolvers.campaigns();

		expect(campaigns).toEqual(expect.arrayContaining(stubs.campaigns));
	});
});
