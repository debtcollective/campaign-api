const sentryWrapper = require('../sentryWrapper')
const Sentry = require('@sentry/node')
const { AuthenticationError } = require('apollo-server')

describe('sentryWrapper', () => {
  afterEach(() => jest.clearAllMocks())

  it('calls Sentry when resolver returns throws an error', async () => {
    const withScopeSpy = jest.spyOn(Sentry, 'withScope')
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const errorResolver = (root, args, context, info) => {
      throw Error("It's Over 9000")
    }
    const resolvers = { errorResolver }

    const resolversWrapped = sentryWrapper(resolvers)

    await expect(
      resolversWrapped.errorResolver(null, {}, {}, {})
    ).rejects.toThrow()
    expect(withScopeSpy).toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('does not call Sentry if error is AuthenticationError', async () => {
    const withScopeSpy = jest.spyOn(Sentry, 'withScope')
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const errorResolver = (root, args, context, info) => {
      throw new AuthenticationError('Auth error')
    }
    const resolvers = { errorResolver }

    const resolversWrapped = sentryWrapper(resolvers)

    await expect(
      resolversWrapped.errorResolver(null, {}, {}, {})
    ).rejects.toThrow()
    expect(withScopeSpy).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })

  it('does not call Sentry if no error is thrown', async () => {
    const withScopeSpy = jest.spyOn(Sentry, 'withScope')
    const consoleErrorSpy = jest.spyOn(console, 'error')
    const noErrorResolver = (root, args, context, info) => {
      return {}
    }
    const resolvers = { noErrorResolver }

    const resolversWrapped = sentryWrapper(resolvers)

    await expect(
      resolversWrapped.noErrorResolver(null, {}, {}, {})
    ).resolves.not.toThrow()
    expect(withScopeSpy).not.toHaveBeenCalled()
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
