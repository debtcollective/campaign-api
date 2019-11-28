const Model = require('../lib/objection')

class BaseModel extends Model {
  $beforeInsert () {
    const date = new Date()
    this.createdAt = date
    this.updatedAt = date
  }

  $beforeUpdate () {
    this.updatedAt = new Date()
  }
}

module.exports = BaseModel
