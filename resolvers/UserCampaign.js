const { UserCampaign } = require('../models/UserCampaign')

const Query = {
  getUserCampaignsCountByMotive: async (root, args, context) => {
    return UserCampaign.getUserCountByMotive()
  }
}

const Mutation = {}

module.exports = {
  Query,
  Mutation
}
