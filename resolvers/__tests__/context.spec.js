const { setContext } = require('../context')
const { fakeCookie } = require('../stubs')
const { User } = require('../../models/User')

afterEach(() => {
  jest.clearAllMocks()
})

beforeEach(async () => {
  await User.query().delete()
})

const getAllUsersCount = async () => {
  const usersCount = await User.query().count('id')

  return Number(usersCount[0].count)
}

test('returns an object with empty user when no auth cookie found', async () => {
  const consoleError = jest.fn()
  // NOTE: avoid to have the error log we know we have on the test run
  jest.spyOn(console, 'error').mockImplementationOnce(consoleError)
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

test('creates a new db record with user data if user is not present', async () => {
  const req = {
    headers: {
      cookie: fakeCookie
    }
  }
  const prevAmountUsers = await getAllUsersCount()

  await setContext({ req })
  const afterAmountUsers = await getAllUsersCount()
  expect(afterAmountUsers - prevAmountUsers).toBe(1)
})

test('retrieves previously created user if present', async () => {
  const req = {
    headers: {
      cookie: fakeCookie
    }
  }
  const prevAmountUsers = await getAllUsersCount()

  // Emulates we send multiple requests
  await setContext({ req })
  await setContext({ req })

  const afterAmountUsers = await getAllUsersCount()

  expect(afterAmountUsers - prevAmountUsers).toBe(1)
})
