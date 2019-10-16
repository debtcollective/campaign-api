const { Campaign } = require("../models/Campaign");
const { User } = require("../models/User");

const queryResolvers = {
	campaigns: async () => {
		const campaigns = await Campaign.query().eager("actions");
		return campaigns;
	},
	userCampaignsActions: async (root, { campaignId, userId }) => {
		const result = await User.query()
			.findById(userId)
			.joinEager("campaigns.actions")
			.where("campaigns.id", campaignId);

		return result;
	}
};

module.exports = {
	queryResolvers
};
