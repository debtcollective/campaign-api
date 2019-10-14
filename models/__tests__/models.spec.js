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

describe("model structure", () => {
	it("allows to insert actions related to a campaign", async () => {
		const campaign = await Campaign.query().insert(createCampaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(createActions());

		expect(campaign.id).toBeTruthy();
		expect(actions).toHaveLength(2);
	});

	it("allows to insert campaigns related to a user", async () => {
		const user = await User.query().insert(createUser());
		const campaign = await user
			.$relatedQuery("campaigns")
			.insert(createCampaign());

		const createdUser = await User.query()
			.findById(user.id)
			.joinEager("campaigns");
		const createdCampaign = await Campaign.query().findById(campaign.id);

		expect(createdUser.id).toBeTruthy();
		expect(createdCampaign.id).toBeTruthy();
		expect(campaign.id).toBeTruthy();
		expect(createdUser.campaigns).toEqual([createdCampaign]);
	});

	it("allows to query actions by user", async () => {
		const user = await User.query().insert(createUser());
		const campaign = await user
			.$relatedQuery("campaigns")
			.insert(createCampaign());
		const actions = await campaign
			.$relatedQuery("actions")
			.insert(createActions());

		const createdUser = await User.query()
			.findById(user.id)
			.joinEager("campaigns.actions");

		expect(user.id).toBeTruthy();
		expect(campaign.id).toBeTruthy();
		expect(actions.length).toBeGreaterThan(0);
		expect(createdUser.campaigns[0].actions).toEqual(
			expect.arrayContaining([campaign.actions[0]])
		);
		expect(createdUser.campaigns[0].actions).toEqual(
			expect.arrayContaining([campaign.actions[1]])
		);
	});

	fit("allows to query user actions by a given campaign", async () => {
		// Create a campaign with actions
		const campaign = await Campaign.query().insert(createCampaign());
		await campaign.$relatedQuery("actions").insert(createActions());

		// Create a campaign with actions that will be fetched
		const targetedCampaign = await Campaign.query().insert(createCampaign());
		const targetedActions = await targetedCampaign
			.$relatedQuery("actions")
			.insert(createActions());

		// Create a user to attach the campaign
		const user = await User.query().insert({
			...createUser(),
			campaigns: [campaign, targetedCampaign]
		});

		const targetedUserActions = await User.query()
			.findById(user.id)
			.joinEager("actions")
			.where("campaignId", targetedCampaign.id);

		// console.log("user", user);
		// console.log("campaign", campaign);
		// console.log("targetedCampaign", targetedCampaign);
		// console.log("targetedActions", targetedActions);

		expect(targetedUserActions).toEqual(targetedActions);
	});
});
