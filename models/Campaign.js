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
				relation: Model.HasManyRelation,
				modelClass: __dirname + "/User",
				join: {
					from: "campaigns.id",
					to: "users.campaignId"
				}
			},
			actions: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + "/Action",
				join: {
					from: "campaigns.id",
					through: {
						from: "campaigns_actions.campaignId",
						to: "campaigns_actions.actionId"
					},
					to: "actions.id"
				}
			}
		};
	}
}

module.exports = {
	Campaign
};
