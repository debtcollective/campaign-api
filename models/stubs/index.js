const faker = require('faker')

module.exports = {
  createUser: fixedData => ({
    email: faker.internet.email(),
    ...fixedData
  }),
  createCampaign: fixedData => ({
    name: faker.lorem.words(2),
    slug: faker.lorem
      .words(2)
      .toLowerCase()
      .split(' ')
      .join('-'),
    ...fixedData
  }),
  createActions: (fixedData, amount = 2) => {
    return Array(amount).fill({
      title: faker.lorem.words(2),
      description: faker.lorem.words(10),
      type: 'Retweet',
      config: { tweet_id: faker.random.number() },
      ...fixedData
    })
  }
}
