const { UserCampaign } = require('../models/UserCampaign')

const Query = {
  getUserCampaignsCountByMotive: async (root, { motive }, context) => {
    return UserCampaign.getUserCountByMotive(motive)
  }
}

const Mutation = {}

module.exports = {
  Query,
  Mutation
}
