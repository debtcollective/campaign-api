const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')
const { Campaign } = require('../models/Campaign')

const setContext = async ({ req }) => {
  let user = null

  const campaign = await Campaign.query().eager('actions').first()

  try {
    const authCookieName = process.env.SSO_COOKIE_NAME

    const cookies = cookie.parse(req.headers.cookie)
    const authToken = cookies[authCookieName]
    const payload = jwt.verify(authToken, process.env.SSO_JWT_SECRET)

    user = await User.findOrCreateFromSSO(payload)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }

  return { User: user, Campaign: campaign }
}

module.exports = {
  setContext
}
