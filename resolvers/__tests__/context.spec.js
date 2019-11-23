const { setContext } = require('../context')
const { fakeCookie } = require('../stubs')

afterEach(() => {
  jest.clearAllMocks()
})

test('returns an object with empty user when no auth cookie found', async () => {
  const consoleError = jest.fn()
  jest.spyOn(console, 'error').mockImplementation(consoleError)
  const req = {
    headers: {
      cookie: ''
    }
  }

  const context = await setContext({ req })

  expect(context).toEqual({ User: {} })
  expect(consoleError).toHaveBeenCalledTimes(1)
})

test('returns an object with user when auth cookie is found', async () => {
  const consoleError = jest.fn()
  jest.spyOn(console, 'error').mockImplementation(consoleError)
  const req = {
    headers: {
      cookie: fakeCookie
    }
  }

  const context = await setContext({ req })

  expect(context.User).toEqual(
    expect.objectContaining({
      external_id: 3,
      username: 'alexis1',
      email: 'alexis@mail.com'
    })
  )
  expect(consoleError).not.toHaveBeenCalledTimes(1)
})
