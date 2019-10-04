/**
 * Objection related code
 */
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");
const { Campaign } = require("./models/Campaign");

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

/**
 * GraphQL
 */
const { ApolloServer, gql } = require("apollo-server");

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

	type Query {
		campaigns: [Campaign]
	}
`;

const resolvers = {
	Query: {
		campaigns: async () => {
			const campaigns = await Campaign.query().eager("actions");
			return campaigns;
		}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	// eslint-disable-next-line
	console.log(`🚀 Server ready at ${url}`);
});
