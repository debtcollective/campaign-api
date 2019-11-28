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
    let context
    let action

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

      action = await Action.query().insert({
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

      context = { User: user, Campaign: campaign }
    })

    describe('with valid data', () => {
      it('creates userAction and returns it', async () => {
        const data = {
          debts: [
            {
              accountStatus: 'Late on payments',
              amount: 5000,
              beingHarrased: 'false',
              creditor: 'Sallie Mae',
              debtType: 'Student debt',
              interestRate: 4.53,
              studentDebtType: 'Subsidized Stafford'
            }
          ],
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        const payload = await Mutation.createDataDuesAction(
          null,
          { data },
          context
        )

        expect(payload).not.toBeNull()
        expect(payload.userAction).not.toBeNull()
        expect(payload.errors).toBeUndefined()
        expect(payload.userAction.completed).toEqual(true)
      })
    })

    describe('with invalid data', () => {
      it('returns errors', async () => {
        // beingHarrased, creditor and debtType are required
        const data = {
          debts: [
            {
              accountStatus: 'Late on payments',
              amount: 5000,
              beingHarrased: '',
              creditor: '',
              debtType: '',
              interestRate: 4.53
            }
          ],
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        const payload = await Mutation.createDataDuesAction(
          null,
          { data },
          context
        )

        expect(payload).not.toBeNull()
        expect(payload.userAction).toBeUndefined()
        expect(payload.errors).not.toBeNull()
        expect(payload.errors).toEqual([
          { field: 'debts[0].debtType', message: 'Debt type is required' },
          { field: 'debts[0].creditor', message: 'Creditor is required' },
          {
            field: 'debts[0].beingHarrased',
            message: 'You need to answer this question'
          }
        ])
      })
    })

    describe('with existing record', () => {
      it('returns existing record', async () => {
        // insert record
        const data = {
          debts: [
            {
              accountStatus: 'Late on payments',
              amount: 5000,
              beingHarrased: '',
              creditor: '',
              debtType: '',
              interestRate: 4.53
            }
          ],
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        await UserAction.query().insert({
          userId: user.id,
          campaignId: campaign.id,
          actionId: action.id,
          completed: true,
          data: { fullName: 'Orlando Del Aguila' }
        })

        const payload = await Mutation.createDataDuesAction(
          null,
          { data },
          context
        )

        expect(payload).not.toBeNull()
        expect(payload.userAction).not.toBeNull()
        expect(payload.errors).toBeUndefined()
        expect(payload.userAction.data).toEqual({
          fullName: 'Orlando Del Aguila'
        })
      })
    })
  })
})
