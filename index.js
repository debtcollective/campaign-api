const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
	type User {
		id: ID!
	}

	type Action {
		id: ID!
		title: String!
		description: String!
	}

	type Campaign {
		id: ID!
		slug: String!
	}

	type Query {
		campaigns: [Campaign]
	}
`;

const campaigns = [
	{
		id: 1,
		slug: "student-debt-campaign"
	}
];

const resolvers = {
	Query: {
		campaigns: () => campaigns
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	// eslint-disable-next-line
	console.log(`🚀 Server ready at ${url}`);
});
