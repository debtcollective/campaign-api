const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')
const { findOrCreate } = require('../models/utils')

const setContext = async ({ req }) => {
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

  const { email, external_id, username } = decoded
  const user = await findOrCreate(User, { email, external_id, username })

  return { User: user }
}

module.exports = {
  setContext
}
