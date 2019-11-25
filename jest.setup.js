// Database preparation
const Knex = require('knex')
const { Model } = require('objection')
const knexConfig = require('./knexfile')

const knex = Knex(knexConfig)
Model.knex(knex)

process.env = {
  SSO_JWT_SECRET: 'jwt-secret',
  SSO_COOKIE_NAME: 'tdc_auth_token',
  DEV_HOST: 'campaign-api.lvh.me',
  DISCOURSE_LOGIN_URL: 'http://lvh.me:3000/session/sso_cookies',
  DISCOURSE_SIGNUP_URL: 'http://lvh.me:3000/session/sso_cookies/signup',
  INTROSPECTION: true,
  PLAYGROUND: true
}
