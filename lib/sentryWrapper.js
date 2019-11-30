const { AuthenticationError } = require('apollo-server')
const Sentry = require('@sentry/node')
const _ = require('lodash')

const sentryWrapper = resolvers =>
  _.mapValues(resolvers, (resolverFn, name) => async (...args) => {
    try {
      const result = await resolverFn(...args)
      return result
    } catch (err) {
      // Ignore AuthenticationError
      if (err instanceof AuthenticationError) {
        throw err
      }
      // eslint-disable-next-line no-console
      console.error('ERROR: ', err, args)
      const [variables, context] = args.slice(1)
      Sentry.withScope(scope => {
        scope.setExtra('resolver', name)
        scope.setExtra('variables', variables)
        scope.setExtra('context', context)
        Sentry.captureException(err)
      })

      throw new Error('Internal Server Error')
    }
  })

module.exports = sentryWrapper
