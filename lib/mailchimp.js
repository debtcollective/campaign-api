const axios = require('axios')
const Sentry = require('@sentry/node')
const crypto = require('crypto')

const mailchimp = {
  addTagsToContact: async (args = {}) => {
    const { list_id, email } = args

    if (!list_id || !email) {
      throw new Error('list_id and email are required')
    }

    const { tags = [] } = args
    const subscriber_hash = mailchimp._subscriberHash(email)
    const requestBody = {
      tags
    }

    try {
      const response = await axios.post(
        `${mailchimp._url}/lists/${list_id}/members/${subscriber_hash}/tags`,
        requestBody,
        {
          auth: {
            username: 'campaignApi',
            password: process.env.MAILCHIMP_API_KEY
          },
          headers: { 'content-type': 'application/json' }
        }
      )
      const data = response.data

      return data
    } catch (e) {
      Sentry.captureException(e)
    }
  },
  _url: 'https://us20.api.mailchimp.com/3.0',
  _subscriberHash: (email = '') =>
    crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')
}

module.exports = mailchimp
