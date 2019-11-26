const _ = require('lodash')
const { Action } = require('../models/Action')
const UserAction = require('../models/UserAction')
const validationSchema = {}

const Query = {}

const Mutation = {
  createDataDuesAction: async (parent, args, context) => {
    // get data from args
    const { data } = args
    const { user, campaign } = context

    // find data dues action for current campaign
    const [action] = await Action.query().where({
      campaignId: campaign.id,
      type: 'data-dues'
    })

    // validate data
    // const errors = yup.validate(validationSchema, data)

    // if invalid return errors

    /* if (!_.isEmpty(errors)) {
      return {
        errors
      }
    } */

    const userAction = await UserAction.query().insert({
      userId: user.id,
      actionId: action.id,
      campaignId: campaign.id,
      completed: true,
      data: data
    })

    return {
      userAction
    }
  }
}

module.exports = {
  Query,
  Mutation
}
