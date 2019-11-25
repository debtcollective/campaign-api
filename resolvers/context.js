const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')

const setContext = async ({ req }) => {
  let decoded

  try {
    const authCookieName = process.env.SSO_COOKIE_NAME
    const cookies = cookie.parse(req.headers.cookie)
    const authToken = cookies[authCookieName]
    decoded = jwt.verify(authToken, process.env.SSO_JWT_SECRET)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)

    return { User: {} }
  }

  const user = await User.findOrCreateFromSSO(decoded)

  return { User: user }
}

module.exports = {
  setContext
}
