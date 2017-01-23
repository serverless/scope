const crypto = require('crypto')
const syncRequest = require('sync-request')
const db = require('./db')
const DEBUG = process.env.DEBUG
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'serverlessbot-2'
const CLOSED_ITEMS_TABLE = process.env.CLOSED_ITEMS_TABLE
const OPEN_ITEMS_TABLE = process.env.OPEN_ITEMS_TABLE

module.exports.githubWebhookListener = (event, context, callback) => {
  // console.log(event)
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

  console.log('action', body.action)
  console.log('event.body', body)

  var issue = body.issue
  const isIssue = issue && !issue.pull_request
  const isPullRequest = body.pull_request || issue && issue.pull_request
  console.log('isPullRequest', isPullRequest)
  if (!issue && !isPullRequest) {
    console.log('Exiting early event not an issue or PR')
    console.log('---------------------------------')
    console.log(`Github-Event: "${githubEvent}"`)
    console.log(`Github-Action: "${body.action}"`)
    console.log('---------------------------------')
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'event is not an Issue or PR',
      })
    })
  }

  var type = 'issue'
  if (isPullRequest) {
    // Pull request require an addition API call for label data
    type = 'pull-request'
    const prData = (issue) ? issue.pull_request : body.pull_request
    const issueURL = prData.url.replace(/\/pulls\//, '/issues/')
    var githubRequestHeaders = {
      'headers': {
        'User-Agent': GITHUB_USERNAME,
      }
    }
    if (GITHUB_API_TOKEN) {
      githubRequestHeaders.headers['Authorization'] = `token ${GITHUB_API_TOKEN}`
    }
    const issueRequest = syncRequest('GET', issueURL, githubRequestHeaders)
    try {
      // Set issue data from PR
      issue = JSON.parse(issueRequest.getBody('utf8'))
    } catch (e) {
      errMsg = '[422] Github JSON malformed'
      return callback(new Error(errMsg))
    }
  }

  // set default labels. Default: []
  var labels = issue.labels
  if (issue.labels && issue.labels.length) {
    labels = issue.labels.map((label) => {
      if (DEBUG) {
        console.log(`Label: ${label.name}`, label)
      }
      return {
        id: label.id,
        name: label.name,
        color: label.color
      }
    })
  }

  // set default labels. Default: []
  var assignees = []
  if (issue.assignees && issue.assignees.length) {
    assignees = issue.assignees.map((assignee, i) => {
      if (DEBUG) {
        console.log('assigneeData', assignee)
      }
      return {
        login: assignee.login,
        id: assignee.id,
      }
    })
  }

  // set default milestone. Default: {}
  var milestone = {}
  if (issue.milestone) {
    milestone = {
      number: issue.milestone.number,
      title: issue.milestone.title,
    }
  }

  // set data to store to DB
  const item = {
    type: type,
    number: issue.number,
    title: issue.title,
    comments: issue.comments,
    // store time as Unix
    updated_at: new Date(issue.created_at).getTime(),
    created_at: new Date(issue.updated_at).getTime(),
    // store additional issue info
    milestone: milestone,
    assignees: assignees,
    labels: labels,
    //id: issue.id
    //state: issue.state
  }

  if (DEBUG) {
    console.log('item', item)
  }

  if (issue.state === 'closed' || issue.closed_at) {
    console.log('Issue or PR closed. Remove from DB')
    db.delete({
      TableName: OPEN_ITEMS_TABLE,
      Key: {
        number: item.number
      },
    }, (err, resp) => {
      if (err) return callback(err)
      console.log(`item ${item.number} deleted from ${OPEN_ITEMS_TABLE} Table`, resp)
      db.put({
        TableName: CLOSED_ITEMS_TABLE,
        Item: item
      }, function(error, response) {
        if (error) return callback(error)
        console.log(`item ${item.number} added to ${CLOSED_ITEMS_TABLE} Table`, response)
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            input: event,
          }),
        })
      })
    })
  } else {
    // add or update item in database
    db.put({
      TableName: OPEN_ITEMS_TABLE,
      Item: item
    }, (err, resp) => {
      if (err) return callback(err)
      console.log(`item ${item.number} added to ${OPEN_ITEMS_TABLE} Table`, resp)
      // Delete from closed table if it's being reopened
      db.delete({
        TableName: CLOSED_ITEMS_TABLE,
        Key: {
          number: item.number
        }
      }, function(err, response) {
        if (err) return callback(err)
        console.log(`item ${item.number} deleted from ${CLOSED_ITEMS_TABLE} Table`, response)
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            input: event,
          })
        })
      })
    })
  }
}

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

module.exports.getItems = (event, context, callback) => {
  db.scan({
    TableName: OPEN_ITEMS_TABLE,
  }, function(err, items) {
    if (err) return callback(err)
    if (DEBUG) console.log(items)

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      })
    })
  })
}

module.exports.getCompletedItems = (event, context, callback) => {
  // https://github.com/acantril/aCloudGuru-DynamoDB/blob/master/ZZ-DataModelv3/datamodelv3.py#L201-L205
  db.scan({
    TableName: CLOSED_ITEMS_TABLE,
  }, function(err, items) {
    if (err) return callback(err)
    if (DEBUG) console.log(items)

    // sort by date range

    return callback(null,  {
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      }),
    })
  })
}
