require('../../lib/objection')

const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { mutationResolvers } = require('../')
const { createCampaign, createUser } = require('../../models/stubs')

beforeAll(async () => {
  await User.query().delete()
  await Campaign.query().delete()
})

afterEach(async () => {
  await User.query().delete()
  await Campaign.query().delete()
})

describe('#addUserToCampaign', () => {
  it('links a user to a campaign if it doesnt have one yet', async () => {
    const responses = Array(2)
    const originalMotive = 'already-on-strike'
    const userData = createUser()
    const campaignData = createCampaign()
    await User.query().insert(userData)
    const user = await User.query().first()
    await Campaign.query().insert(campaignData)
    const campaign = await Campaign.query().first()
    const context = {
      User: user,
      Campaign: campaign
    }

    responses[0] = await mutationResolvers.addUserToCampaign(
      null,
      { motive: originalMotive },
      context
    )
    responses[1] = await mutationResolvers.addUserToCampaign(
      null,
      { motive: 'supporter' },
      context
    )

    const targetedUser = await User.query()
      .findById(user.id)
      .joinEager('campaigns')

    expect(responses[0].ok).toBeTruthy()
    expect(responses[1].ok).toBeFalsy()
    expect(targetedUser.campaigns).toHaveLength(1)
    expect(targetedUser.campaigns[0].data).toEqual(
      expect.objectContaining({ motive: originalMotive })
    )
  })
})
