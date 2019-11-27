require('../../lib/objection')

const { Action } = require('../../models/Action')
const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { UserAction } = require('../../models/UserAction')
const { Mutation } = require('../UserActions')

describe('UserActions resolvers', () => {
  describe('createDataDues', () => {
    let user
    let campaign

    beforeEach(async () => {
      await User.query().delete()
      await Action.query().delete()
      await UserAction.query().delete()
      await Campaign.query().delete()

      // create test campaign
      campaign = await Campaign.query().insert({
        slug: 'end-student-debt',
        name: 'End Student Debt'
      })

      await Action.query().insert({
        campaignId: campaign.id,
        title: 'Data Dues',
        description:
          'Data dues action where we request user about their debt data',
        type: 'data-dues'
      })

      user = await User.query().insert({
        email: 'orlando@debtcollective.org',
        external_id: 1
      })
    })

    it('creates userAction if data is valid', async () => {
      const data = {
        'debts[0].accountStatus': 'Late on payments',
        'debts[0].amount': '5000',
        'debts[0].beingHarrased': 'false',
        'debts[0].creditor': 'Sallie Mae',
        'debts[0].debtType': 'Student debt',
        'debts[0].interestRate': '4.53',
        'debts[0].studentDebtType': 'Subsidized Stafford',
        email: 'betsy.devos@ed.gov',
        fullName: 'Betsy DeVos',
        phoneNumber: '(202) 401-3000'
      }

      const payload = await Mutation.createDataDuesAction(
        null,
        { data },
        { campaign, user }
      )

      expect(payload).not.toBeNull()
      expect(payload.userAction).not.toBeNull()
      expect(payload.userAction.completed).toEqual(true)
    })
  })
})
