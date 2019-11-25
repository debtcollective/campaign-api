require('../../lib/objection')
const faker = require('faker')
const { AuthenticationError } = require('apollo-server')

const { Action } = require('../../models/Action')
const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { UserAction } = require('../../models/UserAction')
const {
  createActions,
  createCampaign,
  createUser
} = require('../../models/stubs')
const { queryResolvers, mutationResolvers } = require('../')
const _ = require('lodash')

const stubs = {}

beforeAll(async () => {
  await User.query().delete()
  await Action.query().delete()
  await Campaign.query().delete()
  await UserAction.query().delete()

  // Create a user with campaign and actions
  const user = await User.query().insert(createUser())
  const campaignOne = await user
    .$relatedQuery('campaigns')
    .insert(createCampaign())
  await campaignOne.$relatedQuery('actions').insert(createActions())

  // Create a widow campaign
  const campaignTwo = await Campaign.query().insert(createCampaign())
  await campaignTwo.$relatedQuery('actions').insert(createActions())

  // Attach an extra campaign to the user
  const campaignThree = await user
    .$relatedQuery('campaigns')
    .insert(createCampaign())
  await campaignThree.$relatedQuery('actions').insert(createActions())

  // Create a widow actions
  await Action.query().insert(createActions()[0])

  // Create an entry of UserAction
  const userActionOne = await UserAction.query().insert({
    actionId: campaignOne.actions[0].id,
    campaignId: campaignOne.id,
    userId: user.id,
    completed: true
  })

  const userActionTwo = await UserAction.query().insert({
    actionId: campaignThree.actions[0].id,
    campaignId: campaignThree.id,
    userId: user.id,
    completed: true
  })

  stubs.campaigns = [campaignOne, campaignTwo, campaignThree]
  stubs.user = user
  stubs.userActions = [userActionOne, userActionTwo]
})

describe('Query resolvers', () => {
  it('returns all campaigns with #campaigns method', async () => {
    const campaigns = await queryResolvers.campaigns()
    const campaignIds = _.map(campaigns, 'id').sort()
    const stubCampaignIds = _.map(stubs.campaigns, 'id').sort()

    expect(campaignIds).toEqual(stubCampaignIds)
  })

  it('returns actions for certain user campaign with #userCampaignsActions method', async () => {
    const targetedCampaign = stubs.campaigns[0]
    const actions = await queryResolvers.userCampaignsActions(null, {
      campaignId: targetedCampaign.id,
      userId: stubs.user.id
    })
    const actionsIds = _.map(actions, 'id').sort()
    const targetedCampaignActionsIds = _.map(
      targetedCampaign.actions,
      'id'
    ).sort()

    expect(actionsIds).toEqual(targetedCampaignActionsIds)
  })

  it("returns the 'UserActions' for a given user", async () => {
    const userActions = await queryResolvers.userActions(null, {
      userId: stubs.user.id
    })
    const userActionsIds = _.map(userActions, 'id').sort()
    const stubUserActionsIds = _.map(stubs.userActions, 'id').sort()

    expect(userActionsIds).toEqual(stubUserActionsIds)
  })

  it("returns the 'UserActions' for a given user filtered by campaignId", async () => {
    const userActions = await queryResolvers.userActions(null, {
      userId: stubs.user.id,
      campaignId: stubs.campaigns[2].id
    })
    const userActionsIds = _.map(userActions, 'id').sort()
    const stubUserActionsIds = [stubs.userActions[1].id]

    expect(userActions).toHaveLength(1)
    expect(userActionsIds).toEqual(stubUserActionsIds)
  })

  it("returns the injected 'User' as a context with #currentUser", async () => {
    const context = {
      User: createUser({ external_id: faker.random.number() })
    }
    const currentUser = await queryResolvers.currentUser(null, null, context)

    expect(currentUser.email).toEqual(context.User.email)
  })

  it("throws authentication error if 'User' doesn't have external_id", async () => {
    // NOTE: external_id is a required field that we expect to have in order to match the user across our apps
    const context = {
      User: createUser({ external_id: undefined })
    }

    await expect(
      queryResolvers.currentUser(null, null, context)
    ).rejects.toThrow(AuthenticationError)
  })
})

describe('Mutation resolvers', () => {
  it('allows to update the completed value with #userActionUpdate', async () => {
    const actionId = stubs.campaigns[0].actions[1].id
    const campaignId = stubs.campaigns[0].id
    const userId = stubs.user.id

    const userAction = await UserAction.query().insert({
      actionId,
      campaignId,
      userId,
      completed: false
    })

    const response = await mutationResolvers.userActionUpdate(null, {
      userActionId: userAction.id,
      completed: true
    })

    const updatedUserAction = await UserAction.query().findById(userAction.id)

    expect(updatedUserAction.completed).toEqual(true)
    expect(response).toEqual(updatedUserAction)
  })
})
