const Model = require('./BaseModel')
const { ref } = require('objection')

class UserCampaign extends Model {
  static get tableName () {
    return 'users_campaigns'
  }

  static async getUserCountByMotive (motive) {
    const result = await UserCampaign.query()
      .select(['id'])
      .where(ref('data:motive').castText(), motive)

    return result.length
  }
}

module.exports = {
  UserCampaign
}
