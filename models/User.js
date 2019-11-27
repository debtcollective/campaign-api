const Model = require('./BaseModel')
const _ = require('lodash')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get SSO_ATTRIBUTES () {
    return Object.keys(this.jsonSchema.properties)
  }

  static async findOrCreateFromSSO (data) {
    const { external_id: externalId } = data
    let user = await User.query().findOne({ external_id: externalId })

    const filteredData = _.pick(data, this.SSO_ATTRIBUTES)

    if (user) {
      user = await user.$query().patchAndFetchById(user.id, filteredData)
    } else {
      user = await User.query().insert({
        external_id: externalId,
        ...filteredData
      })
    }

    return user
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['email', 'external_id'],

      properties: {
        id: { type: 'integer' },
        external_id: { type: 'integer' },
        username: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        avatar_url: { type: 'string', minLength: 1, maxLength: 255 }
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
            to: 'usersCampaigns.campaignId',
            extra: ['data']
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
