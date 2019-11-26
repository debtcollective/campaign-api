const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const { User } = require('../models/User')
const { Campaign } = require('../models/Campaign')

const setContext = async ({ req }) => {
  let decoded
  const motive = req.headers['debtcollective-data']
  const context = {
    User: {},
    UserCampaign: {}
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

  if (motive) {
    const campaign = await Campaign.query().first()
    await user.$relatedQuery('campaigns').relate({
      ...campaign,
      data: { motive }
    })
  }

  const { campaigns } = await user.$query().joinEager('campaigns')
  context.UserCampaign = campaigns[0]

  return context
}

module.exports = {
  setContext
}
