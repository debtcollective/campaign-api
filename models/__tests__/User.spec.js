const Model = require('../../lib/objection')
const { User } = require('../../models/User')

const userData = {
  active: true,
  admin: true,
  avatar_url: '//localhost:3000/letter_avatar_proxy/v4/letter/a/a88e57/45.png',
  card_background_url: null,
  created_at: '2019-11-01 19:55:02 UTC',
  custom_fields: { state: '', zip_code: '', phone_number: '' },
  email: 'john@mail.com',
  external_id: 3,
  groups: ['admins', 'staff', 'trust_level_0', 'trust_level_1'],
  last_seen_at: '2019-11-23 14:55:46 UTC',
  moderator: false,
  name: null,
  profile_background_url: null,
  updated_at: '2019-11-01 19:55:08 UTC',
  username: 'john1'
}
const getAllUsersCount = async () => {
  const usersCount = await User.query().count('id')
  return Number(usersCount[0].count)
}

beforeEach(async () => {
  await User.query().delete()
})

afterAll(async () => {
  await User.query().delete()
  Model.knex().destroy()
})

describe('#findOrCreateFromSSO', () => {
  it('creates a new User entry when user not found', async () => {
    const prevAmountUsers = await getAllUsersCount()
    const user = await User.findOrCreateFromSSO(userData)
    const afterAmountUsers = await getAllUsersCount()

    expect(user.id).toBeTruthy()
    expect(afterAmountUsers - prevAmountUsers).toEqual(1)
  })

  describe('when user has been found', () => {
    it('retrieves a already created user without adding a new record', async () => {
      const prevAmountUsers = await getAllUsersCount()
      await User.findOrCreateFromSSO(userData)
      await User.findOrCreateFromSSO(userData)
      const afterAmountUsers = await getAllUsersCount()

      expect(afterAmountUsers - prevAmountUsers).toEqual(1)
    })

    it('updates user data with new information', async () => {
      const updateData = { email: 'new_mail@mail.com' }
      const prevAmountUsers = await getAllUsersCount()
      await User.findOrCreateFromSSO(userData)

      const user = await User.findOrCreateFromSSO({
        ...userData,
        ...updateData
      })

      const afterAmountUsers = await getAllUsersCount()

      expect(afterAmountUsers - prevAmountUsers).toEqual(1)
      expect(user.email).toEqual(updateData.email)
    })
  })
})
