const Model = require('../../lib/objection')
const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { createCampaign, createUser } = require('../../models/stubs')

// mock discourse request to assign badge
// we assert this call in the test
// https://jestjs.io/docs/en/bypassing-module-mocks
jest.mock('../../lib/discourse', () => ({
  badges: {
    assignBadgeToUser: jest.fn()
  }
}))
const discourse = require('../../lib/discourse')
const { mutationResolvers } = require('../')

afterAll(() => Model.knex().destroy())

beforeAll(async () => {
  await User.query().delete()
  await Campaign.query().delete()
})

afterEach(async () => {
  await User.query().delete()
  await Campaign.query().delete()
})

describe('#addUserToCampaign', () => {
  beforeEach(() => jest.clearAllMocks())

  it('links a user to a campaign if it doesnt have one yet', async () => {
    const responses = Array(2)
    const originalMotive = 'already-on-strike'
    const userData = createUser()
    const campaignData = createCampaign()
    const user = await User.query().insert(userData)
    const campaign = await Campaign.query().insert(campaignData)
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
    expect(discourse.badges.assignBadgeToUser).toHaveBeenCalledTimes(1)
    expect(discourse.badges.assignBadgeToUser).toHaveBeenCalledWith({
      badge_id: process.env.DISCOURSE_BADGE_ID,
      username: user.username
    })
  })
})
