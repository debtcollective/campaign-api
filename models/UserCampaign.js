const Model = require('./BaseModel')

class UserCampaign extends Model {
  static get tableName () {
    return 'users_campaigns'
  }

  static async getUserCountByMotive (motive) {
    const result = await UserCampaign.query()
      .select(['id'])
      .where('data', { motive })

    return result.length
  }
}

module.exports = {
  UserCampaign
}
