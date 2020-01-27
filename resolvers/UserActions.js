const yup = require('yup')
const { Action } = require('../models/Action')
const _ = require('lodash')

// Same validations we use in the client
// We should move these to a shared package later
const unknown = 'Unknown'
const debtTypes = [
  'Student debt',
  'Housing debt',
  'Medical debt',
  'Court or bail fees',
  'Payday loans',
  'Auto loan',
  'Credit card debt',
  'Other'
]
const studentDebtTypes = ['Federal loan', 'Parent Plus loan', 'Private loan']
const accountStatuses = [
  'In repayment',
  'Late on payments',
  'Forbearance/Deferment',
  'Sent to collections'
]
const phoneRegExp = /^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .min(5, 'Full name must be at least ${min} characters') // eslint-disable-line no-template-curly-in-string
    .required('Full name is a required field'),
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is a required field'),
  address: yup.object().shape({
    name: yup.string().required(),
    administrative: yup.string().required(),
    county: yup.string(),
    city: yup.string().required(),
    suburb: yup.string(),
    country: yup.string().required(),
    countryCode: yup.string().required(),
    type: yup.string().required(),
    latlng: yup.object().shape({
      lat: yup.number().required(),
      lng: yup.number().required()
    }),
    postcode: yup.string().required(),
    postcodes: yup.array().of(yup.string()),
    value: yup.string().required()
  }),
  phoneNumber: yup.string().matches(phoneRegExp, {
    message: 'Phone number must be valid',
    excludeEmptyString: true
  }),
  debts: yup.array().of(
    yup.object().shape({
      debtType: yup
        .mixed()
        .oneOf([...debtTypes, unknown], 'Debt type is required'),
      studentDebtType: yup
        .mixed()
        .oneOf([...studentDebtTypes, unknown], 'Student debt type is required'),
      amount: yup.number().required('Amount is required'),
      interestRate: yup.string().required('Interest rate is required'),
      creditor: yup.string().required('This field is required'),
      accountStatus: yup
        .mixed()
        .oneOf([...accountStatuses, unknown], 'Account status is required'),
      beingHarrased: yup.string().required('You need to answer this question'),
      harrasmentDescription: yup.string().when('beingHarrased', {
        is: 'true',
        then: yup.string().required()
      })
    })
  )
})

const Query = {
  getUserActions: async (root, args, context) => {
    const { Campaign: campaign, User: user } = context

    const actions = campaign.actions || []
    const userActions = await user
      .$relatedQuery('userActions')
      .where({ campaignId: campaign.id })

    // TODO: we need to address issue #20
    const result = actions.map(action => {
      const userActionByActionId = _.defaultTo(
        _.find(userActions, {
          actionId: action.id
        }),
        { completed: false }
      )
      const actionData = _.omit(action, ['id'])

      return {
        ...actionData,
        actionId: action.id,
        userActionId: userActionByActionId.id,
        completed: userActionByActionId.completed
      }
    })

    return _.sortBy(result, 'actionId')
  },
  userAction: async (root, { slug }, context) => {
    const { Campaign: campaign, User: user } = context

    const action = _.find(campaign.actions, { slug })

    if (!action) {
      return null
    }

    const userAction = await user
      .$relatedQuery('userActions')
      .findOne({ actionId: action.id })

    return userAction
  }
}

const Mutation = {
  upsertDataDuesAction: async (parent, { data }, context) => {
    const { User: user, Campaign: campaign } = context

    // find data dues action for current campaign
    const action = await Action.query().findOne({
      campaignId: campaign.id,
      slug: 'data-dues'
    })

    return validationSchema
      .validate(data, { abortEarly: false, stripUnknown: true })
      .then(async results => {
        // fetch if there's a data dues action already
        let userAction = await user.$relatedQuery('userActions').findOne({
          campaignId: campaign.id,
          actionId: action.id
        })

        // if there's a record, update it
        if (userAction) {
          await userAction.$query().patch({ data: results })
        } else {
          userAction = await user.$relatedQuery('userActions').insert({
            actionId: action.id,
            campaignId: campaign.id,
            completed: true,
            data: results
          })
        }

        return { userAction }
      })
      .catch(validationErrors => {
        const errors = validationErrors.inner.map(err => {
          return { field: err.path, message: err.message }
        })

        return { errors }
      })
  },
  upsertUserAction: async (parent, { slug, completed, data }, context) => {
    const { User: user, Campaign: campaign } = context

    // find action for current campaign
    const action = await Action.query().findOne({
      campaignId: campaign.id,
      slug
    })

    // return null if action not found
    if (!action) {
      return null
    }

    // fetch if there's a userAction already
    let userAction = await user.$relatedQuery('userActions').findOne({
      campaignId: campaign.id,
      actionId: action.id
    })

    // if there's a record, update it
    // otherwise create one
    if (userAction) {
      await userAction.$query().patch({ completed, data })
    } else {
      userAction = await user.$relatedQuery('userActions').insert({
        actionId: action.id,
        campaignId: campaign.id,
        completed,
        data
      })
    }

    return userAction
  }
}

module.exports = {
  Query,
  Mutation
}
