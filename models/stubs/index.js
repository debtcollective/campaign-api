const faker = require('faker')

module.exports = {
  createUser: fixedData => ({
    email: faker.internet.email(),
    external_id: faker.random.number(),
    username: faker.internet.userName(),
    ...fixedData
  }),
  createCampaign: fixedData => ({
    name: faker.lorem.words(2),
    slug: faker.random.uuid()
  }),
  createActions: (fixedData, amount = 2) => {
    const array = []

    for (let i = 0; i < amount; i = i + 1) {
      array.push({
        title: faker.lorem.words(2),
        description: faker.lorem.words(10),
        slug: faker.random.uuid(),
        type: 'Retweet',
        config: { tweet_id: faker.random.number() },
        ...fixedData
      })
    }

    return array
  }
}
