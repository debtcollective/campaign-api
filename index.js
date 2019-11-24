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
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { ApolloServer } = require('apollo-server')
const { GraphQLJSONObject } = require('graphql-type-json')
const typeDefs = require('./schema')
const { Action } = require('./models/Action')
const { queryResolvers, mutationResolvers } = require('./resolvers')

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
  context: ({ req }) => {
    let decoded

    try {
      const authCookieName = process.env.SSO_COOKIE_NAME
      const cookies = cookie.parse(req.headers.cookie)
      const authToken = cookies[authCookieName]
      decoded = jwt.verify(authToken, process.env.SSO_JWT_SECRET)
    } catch (err) {
      // eslint-disable-next-line
      console.error(err)

      return { User: {} }
    }

    // TODO: create the user entry within our service database
    // const user = User.findOrCreateFromJWT(decoded);
    // User.findByExternalId(decoded.external_id)
    // const user = User.create({external_id, ...rest })

    return { User: decoded }
  }
})

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀 Server ready at ${url}`)
})
