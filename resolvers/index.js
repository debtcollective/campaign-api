const { AuthenticationError } = require('apollo-server')
const { Campaign } = require('../models/Campaign')
const { User } = require('../models/User')
const { UserAction } = require('../models/UserAction')
const { setContext } = require('./context')

const queryResolvers = {
  /**
   * Retieve the campaign scoped for further requests
   */
  currentCampaign: async (root, args, context) => {
    return {
      ...context.UserCampaign
    }
  },
  /**
   * Retrive user using Cookies
   */
  currentUser: async (root, args, context) => {
    if (!context.User.external_id) {
      throw new AuthenticationError('No user logged in')
    }

    return {
      ...context.User,
      // TODO: this id should be related the id generated after create the user using the auth token
      id: 2
    }
  },
  /**
   * Retrieve all the campaigns alongside its actions
   */
  campaigns: async () => {
    const campaigns = await Campaign.query().eager('actions')
    return campaigns
  },
  /**
   * Retrive the actions for a given user and campaign
   */
  userCampaignsActions: async (root, args) => {
    const { campaignId, userId } = args

    const result = await User.query()
      .findById(userId)
      .joinEager('campaigns.actions')
      .where('campaigns.id', campaignId)
    // TODO: we need to avoid to retrieve an array since we look for id
    const campaignActions = result.campaigns[0].actions

    return campaignActions
  },
  /**
   * Retrieve the records of UserActions for a given user and campaign
   */
  userActions: async (root, { userId, campaignId }) => {
    // TODO: avoid the short-circuit and add conditionally "where" filter
    if (campaignId) {
      const result = await User.query()
        .findById(userId)
        .joinEager('userActions')
        .where('campaignId', campaignId)

      return result.userActions
    }

    const result = await User.query()
      .findById(userId)
      .joinEager('userActions')
    return result.userActions
  }
}

const mutationResolvers = {
  /**
   * Updates a record of UserAction to completed or not
   */
  userActionUpdate: async (root, { userActionId, completed }) => {
    const userAction = await UserAction.query().patchAndFetchById(
      userActionId,
      {
        completed
      }
    )

    return userAction
  }
}

module.exports = {
  setContext,
  queryResolvers,
  mutationResolvers
}
