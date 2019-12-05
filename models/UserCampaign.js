const Model = require('./BaseModel')
const { ref } = require('objection')

class UserCampaign extends Model {
  static get tableName () {
    return 'users_campaigns'
  }

  static async getUserCountByMotive () {
    const result = await UserCampaign.query()
      .select(
        ref('users_campaigns.data:motive')
          .castText()
          .as('motive')
      )
      .groupBy('motive')
      .count('id')

    return result
  }
}

module.exports = {
  UserCampaign
}
