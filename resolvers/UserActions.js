const _ = require('lodash')
const yup = require('yup')
const { Action } = require('../models/Action')
const UserAction = require('../models/UserAction')

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
const studentDebtTypes = [
  'Subsidized Stafford',
  'Unsubsidized Stafford',
  'Parent PLUS',
  'Private Student loans'
]
const accountStatuses = [
  'In repayment',
  'Late on payments',
  'Stopped payments',
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
  streetAddress: yup.string(),
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
      creditor: yup.string().required('Creditor is required'),
      accountStatus: yup
        .mixed()
        .oneOf([...accountStatuses, unknown], 'Account status is required'),
      beingHarrased: yup.string().required('You need to answer this question')
    })
  )
})

const Query = {}

const Mutation = {
  createDataDuesAction: async (parent, args, context) => {
    // get data from args
    const { data } = args
    const { user, campaign } = context
    let errors

    // find data dues action for current campaign
    const [action] = await Action.query().where({
      campaignId: campaign.id,
      type: 'data-dues'
    })

    try {
      await validationSchema
        .validate(data, { abortEarly: false })
        .catch(validationErrors => {
          errors = validationErrors.inner.map(err => {
            return { field: err.path, message: err.message }
          })
        })
    } catch (e) {}

    if (!_.isEmpty(errors)) {
      return {
        errors
      }
    }

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
