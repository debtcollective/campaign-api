const { Model } = require("objection");

class UserAction extends Model {
  static get tableName() {
    return "userActions";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["actionId", "userId", "campaignId"],

      properties: {
        id: { type: "integer" },
        actionId: { type: "integer" },
        userId: { type: "integer" },
        campaignId: { type: "integer" }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: __dirname + "/User",
        join: {
          from: "userActions.userId",
          to: "users.id"
        }
      }
    };
  }
}

module.exports = {
  UserAction
};
