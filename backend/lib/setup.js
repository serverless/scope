/**
 * Add issues/PRs to Dynamo to start
 */
const syncRequest = require('sync-request')
const parse = require('parse-link-header')
const formatIssue = require('./issueFormat')
const saveIssue = require('./issueSave')
const REPO = process.env.REPO
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'serverlessbot-2'

module.exports = (event, context, callback) => {
  var issues = []
  // register recursive github api function
  function recursiveAPICall(url, cb) {
    console.log('start recursive call', url)
    var githubRequestHeaders = {
      'headers': {
        'User-Agent': GITHUB_USERNAME,
      }
    }
    if (GITHUB_API_TOKEN) {
      githubRequestHeaders.headers['Authorization'] = `token ${GITHUB_API_TOKEN}`
    }
    // make request to github API
    const getIssues = syncRequest('GET', url, githubRequestHeaders)
    // combine issues array from previous requests
    issues = issues.concat(JSON.parse(getIssues.getBody('utf8')))
    // get pagination data
    const pagination = parse(getIssues.headers['link'])
    if (pagination && pagination.next) {
      // More pages found, make API call for additional data
      recursiveAPICall(pagination.next.url, cb)
    } else {
      // No more data found, return with all issues
      cb(issues)
    }
  }
  const queryParams = '?sort=created&state=open&direction=desc&per_page=100'
  const api = `https://api.github.com/repos/${REPO}/issues${queryParams}`
  // start recursive call
  recursiveAPICall(api, function(issues) {
    // loop over issues and add to database
    console.log(`Found ${issues.length} issues. Adding them to the Dynamo Table`)
    issues.forEach((issue) => {
      var item = formatIssue(issue)
      saveIssue(item)
    })
  })
  console.log('Setup complete.')
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      setup: 'complete',
    }),
  })
}
