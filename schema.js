const { gql } = require("apollo-server");

const typeDefs = gql`
	type User {
		id: ID!
	}

	type Action {
		id: ID!
		"campaign which belongs to"
		campaignId: ID!
		"title of the action"
		title: String!
		"description of the action"
		description: String!
	}

	type Campaign {
		id: ID!
		"human redable identifier"
		slug: String!
		"group of actions for a given campaign"
		actions: [Action]!
	}

	type UserAction {
		id: ID!
		"user identifier for this record"
		userId: ID!
		"action identifier for this record"
		actionId: ID!
		"campaign identifier for this record"
		campaignId: ID!
		"wether or not the user has completed the action"
		completed: Boolean
	}

	type Query {
		campaigns: [Campaign]
		userCampaignsActions(userId: ID!, campaignId: ID!): [Action]
		userActions(userId: ID!, campaignId: ID!): [UserAction]
	}

	type Mutation {
		userActionUpdate(userActionId: ID!, completed: Boolean): Action!
	}
`;

module.exports = typeDefs;
