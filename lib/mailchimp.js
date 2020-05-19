const axios = require('axios')
const Sentry = require('@sentry/node')
const crypto = require('crypto')

const url = 'https://us20.api.mailchimp.com/3.0/'
const mailchimp = {
  /**
   * upserts a contact in a mailchimp list
   * args object {email: string!, list_id: string!, tags: [string]}
   */
  addTagsToContact: async (args = {}) => {
    const { list_id, email } = args

    if (!list_id || !email) {
      throw new Error('list_id and email are required')
    }

    const { tags = [], status_if_new = 'subscribed' } = args
    const subscriber_hash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')

    try {
      const response = await axios.put(
        `${url}/lists/${list_id}/members/${subscriber_hash}/tags`,
        {
          auth: {
            username: 'campaign-api',
            password: process.env.MAILCHIMP_API_KEY
          },
          tags,
          status_if_new,
          email_address: email
        }
      )
      const data = response.json()

      return data
    } catch (e) {
      Sentry.captureException(e)
    }
  }
}

module.exports = mailchimp
