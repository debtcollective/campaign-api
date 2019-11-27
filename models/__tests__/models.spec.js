// Init Ojbection
require('../../lib/objection')

const { Action } = require('../../models/Action')
const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { UserAction } = require('../../models/UserAction')
const { createActions, createCampaign, createUser } = require('../stubs')
const _ = require('lodash')

beforeAll(async () => {
  await User.query().delete()
  await Action.query().delete()
  await Campaign.query().delete()
})

afterAll(async () => {
  await User.query().delete()
  await Action.query().delete()
  await Campaign.query().delete()
})

describe.skip('model structure', () => {
  it('allows to insert actions into campaigns', async () => {
    const campaign = await Campaign.query().insert(createCampaign())
    const actions = await campaign
      .$relatedQuery('actions')
      .insert(createActions())

    expect(campaign.id).toBeTruthy()
    expect(actions).toHaveLength(2)
  })

  it('allows to insert campaigns into a users', async () => {
    const user = await User.query().insert(createUser())
    const campaign = await user
      .$relatedQuery('campaigns')
      .insert(createCampaign())

    const createdUser = await User.query()
      .findById(user.id)
      .joinEager('campaigns')

    expect(createdUser.campaigns).toEqual(
      expect.arrayContaining([expect.objectContaining(campaign)])
    )
  })

  it('allows to query actions by user', async () => {
    // Prepare data
    const user = await User.query().insert(createUser())
    const campaign = await user
      .$relatedQuery('campaigns')
      .insert(createCampaign())
    await campaign.$relatedQuery('actions').insert(createActions())

    // Pretend we need to find the just created user
    const createdUser = await User.query()
      .findById(user.id)
      .joinEager('campaigns.actions')

    const userCampaign = createdUser.campaigns[0]
    const userActionsIds = _.map(userCampaign.actions, 'id')
    const campaignActionsId = [campaign.actions[0].id, campaign.actions[1].id]

    expect(userActionsIds.sort()).toEqual(campaignActionsId.sort())
  })

  it('allows to query user campaign actions', async () => {
    const user = await User.query().insert(createUser())
    const campaignOne = await user
      .$relatedQuery('campaigns')
      .insert(createCampaign())
    await campaignOne.$relatedQuery('actions').insert(createActions())
    const campaignTwo = await user
      .$relatedQuery('campaigns')
      .insert(createCampaign())
    await campaignTwo.$relatedQuery('actions').insert(createActions())

    // Pretend we need to find the actions for campaignOne within just created user
    const createdUser = await User.query()
      .findById(user.id)
      .joinEager('campaigns.actions')
      .where('campaigns.id', campaignOne.id)
    const userCampaign = createdUser.campaigns[0]

    const userActionsIds = _.map(userCampaign.actions, 'id')
    const campaignActionsId = [
      campaignOne.actions[0].id,
      campaignOne.actions[1].id
    ]

    expect(createdUser.campaigns).toHaveLength(1)
    expect(userActionsIds.sort()).toEqual(campaignActionsId.sort())
  })

  it("allows create 'UserAction' with given campaign, action and user id's", async () => {
    const targetedCampaign = await Campaign.query().insert(createCampaign())
    const targetedActions = await targetedCampaign
      .$relatedQuery('actions')
      .insert(createActions())
    const targetedUser = await User.query().insert(createUser())

    // Creates a UserAction from targeted data
    const userAction = await UserAction.query().insert({
      actionId: targetedActions[0].id,
      campaignId: targetedCampaign.id,
      userId: targetedUser.id
    })

    expect(userAction.id).toBeTruthy()
  })

  it("throws an error if trying to create a 'UserAction' with id's that doesn't map to valid entry", async () => {
    await expect(
      UserAction.query().insert({
        actionId: 400,
        campaignId: 400,
        userId: 400
      })
    ).rejects.toBeTruthy()
  })
})
