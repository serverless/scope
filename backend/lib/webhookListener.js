const crypto = require('crypto')
const syncRequest = require('sync-request')
const formatIssue = require('./issueFormat')
const saveIssue = require('./issueSave')
const DEBUG = process.env.DEBUG
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'serverlessbot-2'

module.exports = (event, context, callback) => {
  var errMsg
  const body = JSON.parse(event.body)
  const headers = event.headers
  const signature = headers['X-Hub-Signature']
  const githubEvent = headers['X-GitHub-Event']
  const id = headers['X-GitHub-Delivery']
  const webhookToken = process.env.GITHUB_WEBHOOK_SECRET
  const calculatedSignature = signRequestBody(webhookToken, event.body)

  if (DEBUG) {
    console.log('headers', headers)
    console.log('body', body)
    console.log('X-Hub-Signature: ', signature)
    console.log('calculatedSignature: ', calculatedSignature)
  }

  // Return early on Github 'ping' events for webhook test
  if (body.action === 'ping') {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        pong: true,
      })
    })
  }

  // Validate webtoken exists
  if (!webhookToken || typeof webhookToken !== 'string') {
    errMsg = '[401] must provide a \'GITHUB_WEBHOOK_SECRET\' env variable'
    return callback(new Error(errMsg))
  }

  // Validate signed request from Github
  if (!signature) {
    errMsg = '[401] No X-Hub-Signature found on request'
    return callback(new Error(errMsg))
  }

  // Validate event from Github
  if (!githubEvent) {
    errMsg = '[422] No X-Github-Event found on request'
    return callback(new Error(errMsg))
  }

  // Validate delivery id from Github
  if (!id) {
    errMsg = '[401] No X-Github-Delivery found on request'
    return callback(new Error(errMsg))
  }

  if (signature !== calculatedSignature) {
    errMsg = '[401] X-Hub-Signature incorrect. Github webhook token doesn\'t match'
    return callback(new Error(errMsg))
  }

  // Validation check out. Begin processing event
  console.log('---------------------------------')
  console.log(`Github-Event: "${githubEvent}"`)
  console.log(`Github-Action: "${body.action}"`)
  console.log('---------------------------------')

  var issue = body.issue
  const isIssue = issue && !issue.pull_request
  const isPullRequest = body.pull_request || issue && issue.pull_request
  if (!issue && !isPullRequest) {
    console.log('Exiting early event not an issue or PR', githubEvent)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'event is not an Issue or PR',
      })
    })
  }

  if (isPullRequest) {
    // Pull request require an addition API call for label data
    const issueData = getPullRequestIssueData(issue, body)
    if (issueData) {
      issue = issueData
    } else {
      return callback(new Error('[422] Github JSON malformed'))
    }
  }

  // format issue to store in dynamo
  const item = formatIssue(issue)

  // save issue to database
  saveIssue(item, callback)

}

// Validate webhook secret
function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

// Pull request require an addition API call for label data
function getPullRequestIssueData(issue, body) {
  const prData = (issue) ? issue.pull_request : body.pull_request
  const issueApiURL = prData.url.replace(/\/pulls\//, '/issues/')
  var githubRequestHeaders = {
    'headers': {
      'User-Agent': GITHUB_USERNAME,
    }
  }
  if (GITHUB_API_TOKEN) {
    githubRequestHeaders.headers['Authorization'] = `token ${GITHUB_API_TOKEN}`
  }
  const issueRequest = syncRequest('GET', issueApiURL, githubRequestHeaders)
  try {
    // Set issue data from PR
    return JSON.parse(issueRequest.getBody('utf8'))
  } catch (e) {
    return false
  }
}
