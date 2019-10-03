const { Model } = require("objection");

class Action extends Model {
	static get tableName() {
		return "actions";
	}

	static get jsonSchema() {
		return {
			type: "object",
			required: ["title"],

			properties: {
				id: { type: "integer" },
				title: { type: "string", minLength: 1, maxLength: 255 },
				description: { type: "string", minLength: 1, maxLength: 255 }
			}
		};
	}

	static get relationMappings() {
		return {
			campaigns: {
				relation: Model.ManyToManyRelation,
				modelClass: __dirname + "/Campaign",
				join: {
					from: "actions.id",
					through: {
						from: "campaigns_actions.actionId",
						to: "campaigns_actions.campaignId"
					},
					to: "campaigns.id"
				}
			}
		};
	}
}

module.exports = {
	Action
};
