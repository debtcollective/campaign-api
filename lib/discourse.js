const discourse = require('discourse-node-api')({
  api_key: process.env.DISCOURSE_API_KEY,
  api_username: process.env.DISCOURSE_API_USERNAME,
  api_url: process.env.DISCOURSE_API_URL
})

module.exports = discourse
