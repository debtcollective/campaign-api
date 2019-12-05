const Model = require('../../lib/objection')
const { UserCampaign } = require('../UserCampaign')
const { User } = require('../User')
const { Campaign } = require('../Campaign')
const faker = require('faker')

beforeEach(async () => {
  // Make sure to clean the db before running any assertion
  await User.query().delete()
  await Campaign.query().delete()
})

afterAll(async () => {
  await User.query().delete()
  await Campaign.query().delete()
  Model.knex().destroy()
})

test('retrives the amount of users joined into a campaign for a given motive', async () => {
  // Populate db with data that can be use to emulate the flow to test
  await Campaign.query().insert({
    slug: 'a-campaign',
    name: faker.random.word()
  })
  await User.query().insert({
    external_id: 1,
    email: faker.internet.email()
  })
  await User.query().insert({
    external_id: 2,
    email: faker.internet.email()
  })
  await User.query().insert({
    external_id: 3,
    email: faker.internet.email()
  })

  // Setup variables to make the final assertion
  const motive = 'already-on-strike'
  const randomMotive = faker.random.word()
  const users = Array(3)
  users[0] = await User.query()
    .where('external_id', 1)
    .first()
  users[1] = await User.query()
    .where('external_id', 2)
    .first()
  users[2] = await User.query()
    .where('external_id', 3)
    .first()
  const campaign = await Campaign.query().first()

  // Emulate users has join into the same campaign with a given motive
  await users[0].$relatedQuery('campaigns').relate({
    ...campaign,
    data: { motive }
  })

  await users[1].$relatedQuery('campaigns').relate({
    ...campaign,
    data: { motive }
  })

  await users[2].$relatedQuery('campaigns').relate({
    ...campaign,
    data: { motive: randomMotive }
  })

  await expect(UserCampaign.getUserCountByMotive()).resolves.toEqual(
    expect.arrayContaining([
      {
        motive,
        count: '2'
      },
      {
        motive: randomMotive,
        count: '1'
      }
    ])
  )
})
