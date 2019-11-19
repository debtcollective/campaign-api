const { Model } = require("objection");

class Campaign extends Model {
  static get tableName() {
    return "campaigns";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["slug", "name"],

      properties: {
        id: { type: "integer" },
        slug: { type: "string", minLength: 1, maxLength: 255 },
        name: { type: "string", minLength: 1, maxLength: 255 }
      }
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: __dirname + "/User",
        join: {
          from: "campaigns.id",
          through: {
            from: "users_campaigns.userId",
            to: "users_campaigns.campaignId"
          },
          to: "users.id"
        }
      },
      actions: {
        relation: Model.HasManyRelation,
        modelClass: __dirname + "/Action",
        join: {
          from: "campaigns.id",
          to: "actions.campaignId"
        }
      }
    };
  }
}

module.exports = {
  Campaign
};
