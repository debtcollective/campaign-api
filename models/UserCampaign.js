const Model = require('./BaseModel')
const { ref } = require('objection')

class UserCampaign extends Model {
  static get tableName () {
    return 'users_campaigns'
  }

  static async getUserCountByMotive (motive) {
    const result = await UserCampaign.query()
      // FIXME: this currently doesn't work since json_column not exists
      .select([
        'id',
        ref('jsonColumn:data.motive')
          .castText()
          .as('motive')
      ])
      .where('motive', motive)
      .count('id')
    return Number(result[0].count)
  }
}

module.exports = {
  UserCampaign
}
