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
<<<<<<< HEAD
=======
const { Action } = require('./models/Action')
const { Campaign } = require('./models/Campaign')
const { queryResolvers, mutationResolvers } = require('./resolvers')
>>>>>>> dev(data-dues): add resolver and schema for createDataDuesAction mutation

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
<<<<<<< HEAD
  context: setContext
=======
  context: ({ req }) => {
    let decoded
    // fix campaign to be the first one
    const campaign = Campaign.query().findById(1)

    try {
      const authCookieName = process.env.SSO_COOKIE_NAME
      const cookies = cookie.parse(req.headers.cookie)
      const authToken = cookies[authCookieName]
      decoded = jwt.verify(authToken, process.env.SSO_JWT_SECRET)
    } catch (err) {
      // eslint-disable-next-line

      return { User: {}, campaign }
    }

    // TODO: create the user entry within our service database
    // const user = User.findOrCreateFromJWT(decoded);
    // User.findByExternalId(decoded.external_id)
    // const user = User.create({external_id, ...rest })

    return { User: decoded, campaign }
  }
>>>>>>> dev(data-dues): add resolver and schema for createDataDuesAction mutation
})

server.listen().then(({ url }) => {
  // eslint-disable-next-line
  console.log(`🚀 Server ready at ${url}`)
})
