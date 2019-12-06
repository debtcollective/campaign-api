/**
 * Load environment variables
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config()

/**
 * Init Objection
 */
require('./lib/objection')

/**
 * GraphQL related code
 */
const { Action } = require('./models/Action')
const { User } = require('./models/User')
const { ApolloServer } = require('apollo-server')
const { GraphQLJSONObject } = require('graphql-type-json')
const { queryResolvers, mutationResolvers, setContext } = require('./resolvers')
const typeDefs = require('./schema')
const Sentry = require('@sentry/node')

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
  },
  // Allow to append campaigns data into User request
  User: {
    campaigns: async user => {
      const result = await User.query()
        .findById(user.id)
        .joinEager('campaigns')

      if (result) {
        return result.campaigns
      }

      return []
    }
  }
}

// Init Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN
})

const originSafelist = (process.env.CORS_ORIGIN || '').split(',')

const corsOptions = {
  origin: originSafelist,
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
