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
			campaign: {
				relation: Model.BelongsToOneRelation,
				modelClass: __dirname + "/Campaign",
				join: {
					from: "users.campaignId",
					to: "campaigns.id"
				}
			}
		};
	}
}

module.exports = {
	User
};
