const cookie = require('cookie')
const jwt = require('jsonwebtoken')

const setContext = ({ req }) => {
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

  // TODO: create the user entry within our service database
  // const user = User.findOrCreateFromJWT(decoded);
  // User.findByExternalId(decoded.external_id)
  // const user = User.create({external_id, ...rest })

  return { User: decoded }
}

module.exports = setContext
