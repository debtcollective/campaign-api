/**
 * This script is intended to be used in order to populated easily the development
 * database with data that you may want for E2E testing with client app
 *
 * `dropdb social-giveaways-service-development`
 * `createdb social-giveaways-service-development -U <user>`
 * `npx knex migrate:latest`
 * `node ./models/development.seed.js`
 */

const faker = require("faker");
const Knex = require("knex");
const knexConfig = require("../../knexfile");
const { Model } = require("objection");

const { Action } = require("../../models/Action");
const { Campaign } = require("../../models/Campaign");
const { User } = require("../../models/User");
const { UserAction } = require("../../models/UserAction");
const { createActions, createCampaign, createUser } = require("../stubs");

const knex = Knex(knexConfig.development);
Model.knex(knex);

const main = async () => {
	await User.query().delete();
	await Action.query().delete();
	await Campaign.query().delete();
	await UserAction.query().delete();

	// Create a user with campaign and actions
	const user = await User.query().insert(createUser());
	const campaignOne = await user
		.$relatedQuery("campaigns")
		.insert(createCampaign());
	await campaignOne.$relatedQuery("actions").insert([
		...createActions(
			{
				type: "LINK",
				config: {
					href: faker.internet.url(),
					text: faker.random.words(2),
					target: "_blank",
					delay: 200
				}
			},
			1
		),
		...createActions(
			{
				type: "LINK",
				config: {
					href: faker.internet.url(),
					text: faker.random.words(2),
					target: "_blank",
					delay: 200
				}
			},
			1
		),
		...createActions(
			{
				type: "LINK",
				config: {
					href: faker.internet.url(),
					text: faker.random.words(2),
					target: "_blank",
					delay: 200
				}
			},
			1
		)
	]);

	// Create a widow campaign
	const campaignTwo = await Campaign.query().insert(createCampaign());
	await campaignTwo.$relatedQuery("actions").insert(
		createActions({
			type: "LINK",
			config: {
				href: faker.internet.url(),
				text: faker.random.words(2),
				target: "_blank",
				delay: 200
			}
		})
	);

	// Attach an extra campaign to the user
	const campaignThree = await user
		.$relatedQuery("campaigns")
		.insert(createCampaign());
	await campaignThree.$relatedQuery("actions").insert(
		createActions({
			type: "LINK",
			config: {
				href: faker.internet.url(),
				text: faker.random.words(2),
				target: "_blank",
				delay: 200
			}
		})
	);

	// Create a widow actions
	await Action.query().insert(
		createActions({
			type: "LINK",
			config: {
				href: faker.internet.url(),
				text: faker.random.words(2),
				target: "_blank",
				delay: 200
			}
		})[0]
	);

	// Create an entry of UserAction
	await UserAction.query().insert({
		actionId: campaignOne.actions[0].id,
		campaignId: campaignOne.id,
		userId: user.id,
		completed: false
	});

	await UserAction.query().insert({
		actionId: campaignOne.actions[1].id,
		campaignId: campaignOne.id,
		userId: user.id,
		completed: false
	});

	await UserAction.query().insert({
		actionId: campaignOne.actions[2].id,
		campaignId: campaignOne.id,
		userId: user.id,
		completed: false
	});

	await UserAction.query().insert({
		actionId: campaignThree.actions[0].id,
		campaignId: campaignThree.id,
		userId: user.id,
		completed: true
	});
};

main();

Promise.all([main()]).then(process.exit);