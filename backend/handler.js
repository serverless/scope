const setup = require('./lib/setup')
const getOpenIssues = require('./lib/getOpenIssues')
const getClosedIssues = require('./lib/getClosedIssues')
const webhookListener = require('./lib/webhookListener')
const tearDown = require('./lib/tearDown')

/* Function that listens for github webhook events */
module.exports.githubWebhookListener = webhookListener

/* Function gets all open issues from DynamoDB */
module.exports.getOpenIssues = getOpenIssues

/* Function gets all closed issues from DynamoDB */
module.exports.getClosedIssues = getClosedIssues

/* Function for initial setup to seed issue data in DynamoDB */
module.exports.setup = setup

/* Function for clearing out DynamoDB in case you want to reset tables */
module.exports.tearDown = tearDown
