const faker = require('faker')
const { queryResolvers } = require('..')

test('returns context campaign', async () => {
  const context = { UserCampaign: { id: faker.random.number() } }
  const currentCampaign = await queryResolvers.currentCampaign(
    null,
    null,
    context
  )

  expect(currentCampaign.id).toEqual(context.UserCampaign.id)
})
