const Model = require('../../lib/objection')
const { Action } = require('../../models/Action')
const { Campaign } = require('../../models/Campaign')
const { User } = require('../../models/User')
const { UserAction } = require('../../models/UserAction')
const { Mutation, Query } = require('../UserActions')
const faker = require('faker')
const _ = require('lodash')

afterAll(() => Model.knex().destroy())

describe('UserActions resolvers', () => {
  describe('upsertDataDuesAction', () => {
    let user
    let campaign
    let context
    let action

    beforeEach(async () => {
      await UserAction.query().delete()
      await Action.query().delete()
      await User.query().delete()
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
              interestRate: '4.53',
              studentDebtType: 'Subsidized Stafford'
            }
          ],
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        const payload = await Mutation.upsertDataDuesAction(
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
              interestRate: '4.53'
            }
          ],
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        const payload = await Mutation.upsertDataDuesAction(
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
      it('updates existing record', async () => {
        // insert record
        await UserAction.query().insert({
          userId: user.id,
          campaignId: campaign.id,
          actionId: action.id,
          completed: true,
          data: {
            fullName: 'Orlando Del Aguila',
            email: 'orlando@debtcollective.org'
          }
        })

        const data = {
          debts: [
            {
              accountStatus: 'Late on payments',
              amount: 5000,
              beingHarrased: 'false',
              creditor: 'Sallie Mae',
              debtType: 'Student debt',
              studentDebtType: 'Parent PLUS',
              interestRate: '4.53'
            }
          ],
          streetAddress: '400 Maryland Avenue, SW. Washington, DC 20202',
          email: 'betsy.devos@ed.gov',
          fullName: 'Betsy DeVos',
          phoneNumber: '(202) 401-3000'
        }

        const payload = await Mutation.upsertDataDuesAction(
          null,
          { data },
          context
        )

        expect(payload).not.toBeNull()
        expect(payload.userAction).not.toBeNull()
        expect(payload.errors).toBeUndefined()
        expect(payload.userAction.data).toEqual(data)
      })
    })
  })

  describe('getUserActions query', () => {
    const stubs = {
      currentUser: null,
      currentCampaign: null,
      actions: []
    }

    beforeEach(async () => {
      // Clean the database
      await UserAction.query().delete()
      await Action.query().delete()
      await User.query().delete()
      await Campaign.query().delete()

      // Create a base campaign to work with
      const campaign = await Campaign.query().insert({
        slug: 'end-student-debt',
        name: 'End Student Debt'
      })

      // Create actions
      const actions = Array(3)
      actions[0] = await Action.query().insert({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        type: _.sample(['Retweet', 'Link', 'Share']),
        config: { fake_number: faker.random.number() },
        campaignId: campaign.id
      })
      actions[1] = await Action.query().insert({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        type: _.sample(['Retweet', 'Link', 'Share']),
        config: { fake_number: faker.random.number() },
        campaignId: campaign.id
      })
      actions[2] = await Action.query().insert({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        type: _.sample(['Retweet', 'Link', 'Share']),
        config: { fake_number: faker.random.number() },
        campaignId: campaign.id
      })

      // Create a user to work with
      const user = await User.query().insert({
        email: faker.internet.email(),
        external_id: faker.random.number(10)
      })

      stubs.currentCampaign = campaign
      stubs.currentUser = user
      stubs.actions = actions
    })

    it('returns all actions for currentCampaign', async () => {
      const context = {
        User: stubs.currentUser,
        Campaign: stubs.currentCampaign
      }
      const userId = stubs.currentUser.id

      const result = await Query.getUserActions(null, { userId }, context)

      result.forEach((item, index) => {
        expect(item.title).toEqual(stubs.actions[index].title)
        expect(item.completed).toBeFalsy()
      })
    })

    it('returns completed status for each action', async () => {
      const context = {
        User: stubs.currentUser,
        Campaign: stubs.currentCampaign
      }
      const userId = stubs.currentUser.id

      // pretend a completed action using `actions[0].id`
      await UserAction.query().insert({
        actionId: stubs.actions[0].id,
        campaignId: stubs.currentCampaign.id,
        userId: stubs.currentUser.id,
        completed: true
      })

      const result = await Query.getUserActions(null, { userId }, context)

      expect(result[0].completed).toBeTruthy()
    })

    it('returns a reference to the userActionId and actionId', async () => {
      const context = {
        User: stubs.currentUser,
        Campaign: stubs.currentCampaign
      }
      const userId = stubs.currentUser.id
      const firstAction = await Action.query().first()

      // create a UserAction using `actions[0].id`
      const userAction = await UserAction.query().insert({
        actionId: stubs.actions[0].id,
        campaignId: stubs.currentCampaign.id,
        userId: stubs.currentUser.id
      })

      const result = await Query.getUserActions(null, { userId }, context)

      expect(result[0].userActionId).toEqual(userAction.id)
      expect(result[0].actionId).toEqual(firstAction.id)
    })
  })
})
