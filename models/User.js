const Model = require('../lib/objection')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['email'],

      properties: {
        id: { type: 'integer' },
        email: { type: 'string', minLength: 1, maxLength: 255 }
      }
    }
  }

  static get relationMappings () {
    return {
      campaigns: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/Campaign`,
        join: {
          from: 'users.id',
          through: {
            from: 'usersCampaigns.userId',
            to: 'usersCampaigns.campaignId'
          },
          to: 'campaigns.id'
        }
      },
      userActions: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/UserAction`,
        join: {
          from: 'users.id',
          to: 'userActions.userId'
        }
      }
    }
  }
}

module.exports = {
  User
}
