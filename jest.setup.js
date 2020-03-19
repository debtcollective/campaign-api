// Database preparation
const Knex = require('knex')
const { Model } = require('objection')
const knexConfig = require('./knexfile')

const knex = Knex(knexConfig)
Model.knex(knex)

process.env = {
  DEV_HOST: 'campaign-api.lvh.me',
  DISCOURSE_API_KEY: '123456789',
  DISCOURSE_API_URL: 'http://lvh.me:3000',
  DISCOURSE_API_USERNAME: 'system',
  DISCOURSE_BADGE_ID: 102,
  DISCOURSE_LOGIN_URL: 'http://lvh.me:3000/session/sso_cookies',
  DISCOURSE_SIGNUP_URL: 'http://lvh.me:3000/session/sso_cookies/signup',
  INTROSPECTION: true,
  PLAYGROUND: true,
  SSO_COOKIE_NAME: 'tdc_auth_token',
  SSO_JWT_SECRET: 'jwt-secret'
}
