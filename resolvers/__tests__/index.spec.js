const Knex = require("knex");
const knexConfig = require("../../knexfile");
const { Model } = require("objection");

const { Action } = require("../../models/Action");
const { Campaign } = require("../../models/Campaign");
const { User } = require("../../models/User");
const { UserAction } = require("../../models/UserAction");
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

	// Attach an extra campaign to the user
	const campaignThree = await user
		.$relatedQuery("campaigns")
		.insert(createCampaign());
	await campaignThree.$relatedQuery("actions").insert(createActions());

	// Create a widow actions
	await Action.query().insert(createActions()[0]);

	// Create an entry of UserAction
	const userActionOne = await UserAction.query().insert({
		actionId: campaignOne.actions[0].id,
		campaignId: campaignOne.id,
		userId: user.id,
		completed: true
	});

	const userActionTwo = await UserAction.query().insert({
		actionId: campaignThree.actions[0].id,
		campaignId: campaignThree.id,
		userId: user.id,
		completed: true
	});

	stubs.campaigns = [campaignOne, campaignTwo, campaignThree];
	stubs.user = user;
	stubs.userActions = [userActionOne, userActionTwo];
});

describe("Query resolvers", () => {
	it("returns all campaigns with #campaigns method", async () => {
		const campaigns = await queryResolvers.campaigns();

		expect(campaigns).toEqual(expect.arrayContaining(stubs.campaigns));
	});

	it("returns actions for certain user campaign with #userCampaignsActions method", async () => {
		const targetedCampaign = stubs.campaigns[0];
		const actions = await queryResolvers.userCampaignsActions(null, {
			campaignId: targetedCampaign.id,
			userId: stubs.user.id
		});

		expect(actions).toEqual(targetedCampaign.actions);
	});

	it("returns the 'UserActions' for a given user", async () => {
		const userActions = await queryResolvers.userActions(null, {
			userId: stubs.user.id
		});

		expect(userActions).toEqual(expect.arrayContaining(stubs.userActions));
	});

	it("returns the 'UserActions' for a given user filtered by campaignId", async () => {
		const userActions = await queryResolvers.userActions(null, {
			userId: stubs.user.id,
			campaignId: stubs.campaigns[2].id
		});

		expect(userActions).toHaveLength(1);
		expect(userActions).toEqual(expect.arrayContaining([stubs.userActions[1]]));
	});
});
