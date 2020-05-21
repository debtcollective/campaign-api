const mailchimp = require('../mailchimp')
const axios = require('axios')

jest.mock('axios')

describe('mailchimp', () => {
  describe('addTagsToContact', () => {
    afterAll(() => jest.clearAllMocks())

    it('throws error if list_id or email are not passed', async () => {
      await expect(mailchimp.addTagsToContact()).rejects.toThrow(Error)
    })

    it('updates tags for a contact if params are passed correctly', async () => {
      const params = {
        list_id: '123456',
        email: 'orlando@debtcollective.org',
        tags: [{ name: 'Test Tag', status: 'active' }]
      }
      const subscriber_hash = mailchimp._subscriberHash(params.email)

      axios.post.mockImplementationOnce(() =>
        Promise.resolve({ data: {}, status: 204 })
      )

      await mailchimp.addTagsToContact(params)

      expect(axios.post).toHaveBeenCalledWith(
        `${mailchimp._url}/lists/${params.list_id}/members/${subscriber_hash}/tags`,
        { tags: params.tags },
        expect.anything()
      )
    })
  })
})
