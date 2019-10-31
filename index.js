/**
 * Objection related code
 */
const Knex = require("knex");
const knexConfig = require("./knexfile");
const { Model } = require("objection");
const { queryResolvers, mutationResolvers } = require("./resolvers");
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
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	// eslint-disable-next-line
	console.log(`🚀 Server ready at ${url}`);
});
