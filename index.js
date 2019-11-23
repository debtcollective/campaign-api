require('dotenv').config()

/**
 * Init Objection
 */
require('./lib/objection')

/**
 * GraphQL related code
 */
const { Action } = require('./models/Action')
const { ApolloServer } = require('apollo-server')
const { GraphQLJSONObject } = require('graphql-type-json')
const { Model } = require('objection')
const { queryResolvers, mutationResolvers, setContext } = require('./resolvers')
const Knex = require('knex')
const knexConfig = require('./knexfile.js')
const typeDefs = require('./schema')

// Initialize knex.
const knex = Knex(knexConfig)
Model.knex(knex)

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
      const { actionId } = userAction
      const result = await Action.query().findById(actionId)
      return result
    }
  }
}

const corsOptions = {
  origin: 'http://campaign.lvh.me:8000',
  credentials: true
}

const server = new ApolloServer({
  cors: corsOptions,
  typeDefs,
  resolvers,
  introspection: process.env.INTROSPECTION,
  playground: process.env.PLAYGROUND,
  context: setContext
})

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀 Server ready at ${url}`)
})
