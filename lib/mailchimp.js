const axios = require('axios')
const Sentry = require('@sentry/node')
const crypto = require('crypto')

const mailchimp = {
  addTagsToContact: (args = {}) => {
    const { list_id, email } = args

    if (!list_id || !email) {
      throw new Error('list_id and email are required')
    }

    const { tags = [] } = args
    const subscriber_hash = mailchimp._subscriberHash(email)
    const requestBody = { tags }
    const url = `${mailchimp._url}/lists/${list_id}/members/${subscriber_hash}/tags`
    const requestHeaders = {
      auth: {
        username: 'campaignApi',
        password: process.env.MAILCHIMP_API_KEY
      },
      headers: { 'content-type': 'application/json' }
    }

    return axios
      .post(url, requestBody, requestHeaders)
      .then(response => response.data)
      .catch(e => Sentry.captureException(e))
  },
  _url: 'https://us20.api.mailchimp.com/3.0',
  _subscriberHash: (email = '') =>
    crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')
}

module.exports = mailchimp
