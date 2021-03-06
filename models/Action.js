const Model = require('./BaseModel')

class Action extends Model {
  static get tableName () {
    return 'actions'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['title'],

      properties: {
        id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', minLength: 1, maxLength: 255 },
        type: { type: 'string', minLength: 1, maxLength: 255 }
      }
    }
  }

  static get relationMappings () {
    return {
      campaign: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Campaign`,
        join: {
          from: 'actions.campaignId',
          to: 'campaigns.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'actions.id',
          through: {
            from: 'usersActions.actionId',
            to: 'usersActions.userId',
            extra: ['completed']
          },
          to: 'users.id'
        }
      }
      // TODO: we need to address issue #20
    }
  }
}

module.exports = {
  Action
}
