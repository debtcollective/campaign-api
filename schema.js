const { gql } = require('apollo-server')

const typeDefs = gql`
  scalar JSONObject

  type UserCampaign {
    # identifier of the relation
    id: ID!
    # identifier of user
    user_id: ID!
    # identifier of campaign
    campaign_id: ID!
    # metadata for the relation (such as motive)
    data: JSONObject
  }

  type User {
    id: ID
    email: String
    username: String
    name: String
    avatar_url: String
    external_id: ID
    campaigns: [UserCampaign]
  }

  type Action {
    id: ID!
    "campaign which belongs to"
    campaignId: ID!
    "title of the action"
    title: String!
    "action slug"
    slug: String!
    "description of the action"
    description: String!
    "define the type of UI to render"
    type: String!
    "all the elements needed in order to render the whole UI composition"
    config: JSONObject
  }

  type Campaign {
    id: ID!
    "human redable identifier"
    slug: String!
    "group of actions for a given campaign"
    actions: [Action]!
  }

  type UserAction {
    id: ID!
    "user identifier for this record"
    userId: ID!
    "action identifier for this record"
    actionId: ID!
    "campaign identifier for this record"
    campaignId: ID!
    "wether or not the user has completed the action"
    completed: Boolean!
    "common data related to the action"
    action: Action
    " JSONB data"
    data: JSONObject
  }

  type Ok {
    ok: Boolean!
  }

  type Query {
    currentCampaign: Campaign!
    currentUser: User!
    campaigns: [Campaign]
    userCampaignsActions(userId: ID!, campaignId: ID!): [Action]
    getUserActions: [GetUserActionsPayload]
    userAction(slug: String!): UserAction
    getUserCampaignsCountByMotive(motive: String!): Int!
  }

  type GetUserActionsPayload {
    actionId: ID!
    userActionId: ID
    campaignId: ID!
    title: String
    description: String
    type: String!
    config: JSONObject
    completed: Boolean!
    slug: String!
  }

  type Mutation {
    userActionUpdate(userActionId: ID!, completed: Boolean): UserAction!
    addUserToCampaign(motive: String!): Ok!
    upsertDataDuesAction(data: JSONObject): UpsertDataDuesActionPayload!
    upsertUserAction(
      slug: String!
      completed: Boolean
      data: JSONObject
    ): UserAction!
  }

  type UpsertDataDuesActionPayload {
    errors: JSONObject
    userAction: UserAction
  }
`

module.exports = typeDefs
