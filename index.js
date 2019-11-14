/**
 * Objection related code
 */
const Knex = require("knex");
const knexConfig = require("./knexfile.js");
const { Model } = require("objection");
const { queryResolvers, mutationResolvers } = require("./resolvers");
const { Action } = require("./models/Action");
const typeDefs = require("./schema");

// Initialize knex.
const knex = Knex(knexConfig);
Model.knex(knex);

/**
 * GraphQL related code
 */
const cookie = require("cookie");
const { ApolloServer } = require("apollo-server");
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

const corsOptions = {
	origin: "http://campaign.lvh.me:8000",
	credentials: true
};

const server = new ApolloServer({
	cors: corsOptions,
	typeDefs,
	resolvers,
	context: ({ req }) => {
		if (!req.headers.cookie) {
			return {};
		}

		const cookies = cookie.parse(req.headers.cookie);

		// const jwt = cookies[JWT_COOKIE_NAME];
		// const payload, headers = JWT.decode(jwt)
		// const user = User.findOrCreate(jwtPayload)

		return {};
	}
});

server.listen().then(({ url }) => {
	// eslint-disable-next-line
  console.log(`🚀 Server ready at ${url}`);
});
