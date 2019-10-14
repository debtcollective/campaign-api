const { Model } = require("objection");

class User extends Model {
	static get tableName() {
		return "users";
	}

	static get jsonSchema() {
		return {
			type: "object",
			required: ["email"],

			properties: {
				id: { type: "integer" },
				email: { type: "string", minLength: 1, maxLength: 255 }
			}
		};
	}

	static get relationMappings() {
		return {
			campaigns: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + "/Campaign",
				join: {
					from: "users.id",
					through: {
						from: "users_campaigns.userId",
						to: "users_campaigns.campaignId"
					},
					to: "campaigns.id"
				}
			},
			actions: {
				relation: Model.HasManyRelation,
				modelClass: __dirname + "/Action",
				join: {
					from: "users.id",
					through: {
						from: "users_actions.userId",
						to: "users_actions.actionId",
						extra: ["completed"]
					},
					to: "actions.id"
				}
			}
		};
	}
}

module.exports = {
	User
};
