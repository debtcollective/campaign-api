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
		// TODO: we need to avoid to retrieve an array since we look for id
		const campaignActions = result.campaigns[0].actions;

		return campaignActions;
	},
	userActions: async (root, { userId, campaignId }) => {
		// TODO: avoid the short-circuit and add conditionally "where" filter
		if (campaignId) {
			const result = await User.query()
				.findById(userId)
				.joinEager("userActions")
				.where("campaignId", campaignId);

			return result.userActions;
		}

		const result = await User.query()
			.findById(userId)
			.joinEager("userActions");
		return result.userActions;
	}
};

module.exports = {
	queryResolvers
};
