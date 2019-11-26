const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')
const { Campaign } = require('../models/Campaign')

const setContext = async ({ req }) => {
  let decoded
  const context = {
    User: {},
    Campaign: {}
  }

  try {
    const authCookieName = process.env.SSO_COOKIE_NAME
    const cookies = cookie.parse(req.headers.cookie)
    const authToken = cookies[authCookieName]
    decoded = jwt.verify(authToken, process.env.SSO_JWT_SECRET)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)

    return context
  }

  const user = await User.findOrCreateFromSSO(decoded)
  context.User = user

  const campaign = await Campaign.query().first()
  context.Campaign = campaign

  return context
}

module.exports = {
  setContext
}
