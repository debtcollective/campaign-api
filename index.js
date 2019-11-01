/**
 * Objection related code
 */
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");
const { queryResolvers, mutationResolvers } = require("./resolvers");
const { Action } = require("./models/Action");
const typeDefs = require("./schema");

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex);

/**
 * GraphQL related code
 */
const { GraphQLJSONObject } = require("graphql-type-json");
const { ApolloServer } = require("apollo-server");

const resolvers = {
	/**
	 * Custom scalar in order to support "Object" without
	 * strong type properties
	 * WARNING: this should be used only for specific proposes
	 */
	JSONObject: GraphQLJSONObject,
	Query: {
		...queryResolvers
	},
	Mutation: {
		...mutationResolvers
	},
	// Allow to append action data into the UserAction request
	UserAction: {
		action: async userAction => {
			const { actionId } = userAction;
			const result = await Action.query().findById(actionId);
			return result;
		}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	// eslint-disable-next-line
	console.log(`🚀 Server ready at ${url}`);
});
