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

const campaigns = [
	{
		id: 1,
		slug: "student-debt-campaign",
		actions: [
			{
				title: "Visit our Facebook page",
				description: "Go to our facebook page and click like button"
			}
		]
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
