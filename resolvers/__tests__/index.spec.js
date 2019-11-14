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
const { queryResolvers, mutationResolvers } = require("../");

const knex = Knex(knexConfig);
Model.knex(knex);

const stubs = {};

beforeAll(async () => {
	await User.query().delete();
	await Action.query().delete();
	await Campaign.query().delete();
	await UserAction.query().delete();

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

		expect(actions).toEqual(expect.arrayContaining(targetedCampaign.actions));
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

describe("Mutation resolvers", () => {
	it("allows to update the completed value with #userActionUpdate", async () => {
		const actionId = stubs.campaigns[0].actions[1].id;
		const campaignId = stubs.campaigns[0].id;
		const userId = stubs.user.id;

		const userAction = await UserAction.query().insert({
			actionId,
			campaignId,
			userId,
			completed: false
		});

		const response = await mutationResolvers.userActionUpdate(null, {
			userActionId: userAction.id,
			completed: true
		});

		const updatedUserAction = await UserAction.query().findById(userAction.id);

		expect(updatedUserAction.completed).toEqual(true);
		expect(response).toEqual(updatedUserAction);
	});
});
