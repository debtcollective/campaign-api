module.exports = {
  // https://github.com/Vincit/objection.js/issues/192
  findOrCreate: async (Model, data) => {
    const fetched = await Model.query().where(data)
    if (fetched.length === 0) {
      return Model.query().insert(data)
    }

    return fetched
  }
}
