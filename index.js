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
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const { GraphQLJSONObject } = require("graphql-type-json");

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

const server = new ApolloServer({
	cors: true,
	typeDefs,
	resolvers,
	context: ({ req }) => {
		console.log(">", req);
	}
});

const app = express();
const path = "/";
const corsOptions = {
	origin: "http://campaign.lvh.me:8000",
	credentials: true
};

server.applyMiddleware({ app, path, cors: corsOptions });

app.listen({ port: 4000 }, () =>
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
