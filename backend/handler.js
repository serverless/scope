const setup = require('./lib/setup')
const getOpenIssues = require('./lib/getOpenIssues')
const getClosedIssues = require('./lib/getClosedIssues')
const webhookListener = require('./lib/webhookListener')
const tearDown = require('./lib/tearDown')

module.exports.githubWebhookListener = webhookListener

module.exports.getOpenIssues = getOpenIssues

module.exports.getClosedIssues = getClosedIssues

module.exports.setup = setup

module.exports.tearDown = tearDown
