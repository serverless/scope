const crypto = require('crypto')
const syncRequest = require('sync-request')
const db = require('./db')

function signRequestBody(key, body) {
  return `sha1=${crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex')}`;
}

module.exports.githubWebhookListener = (event, context, callback) => {
  var errMsg
  const token = process.env.GITHUB_WEBHOOK_SECRET
  // console.log('token', token)
  const headers = event.headers
  // console.log('headers', headers)
  const sig = headers['X-Hub-Signature']
  const githubEvent = headers['X-GitHub-Event']
  const id = headers['X-GitHub-Delivery']
  const calculatedSig = signRequestBody(token, JSON.stringify(event.body))
  // console.log(event)
  if (typeof token !== 'string') {
    errMsg = '[401] must provide a \'GITHUB_WEBHOOK_SECRET\' env variable'
    return callback(new Error(errMsg))
  }

  if (!sig) {
    errMsg = '[401] No X-Hub-Signature found on request'
    return callback(new Error(errMsg))
  }

  if (!githubEvent) {
    errMsg = '[422] No X-Github-Event found on request'
    return callback(new Error(errMsg))
  }

  if (!id) {
    errMsg = '[401] No X-Github-Delivery found on request'
    return callback(new Error(errMsg))
  }
  // console.log('sig', sig)
  // console.log('calculatedSig', calculatedSig)
  if (sig !== calculatedSig) {
    errMsg = '[401] X-Hub-Signature incorrect. Github webhook token doesn\'t match'
    return callback(new Error(errMsg))
  }

  var data = {
    // webhook_id: id, // webhook X-Github-Delivery uid
    // event: githubEvent, // webhook X-Github-Event
    // action: event.body.action
    // body: event.body,
  }
  // console.log('event.body', event.body)
  var issue = event.body.issue
  const isIssue = issue && !issue.pull_request
  const isPullRequest = event.body.pull_request || issue && issue.pull_request
  console.log('---------------------------------')
  console.log(`Github-Event: "${githubEvent}" with action: "${event.body.action}"`)
  console.log('---------------------------------')
  // Handle Issue logic
  if (isIssue) {
    data.type = 'issue'
  } else if (isPullRequest) {
    // Handle PR logic
    data.type = 'pull-request'
    const prData = (issue) ? issue.pull_request : event.body.pull_request
    const issueURL = prData.url.replace(/\/pulls\//, '/issues/')

    const githubAPItoken = process.env.GITHUB_API_TOKEN
    const issueRequest = syncRequest('GET', issueURL, {
      'headers': {
        'User-Agent': 'serverlessbot-2',
        'Authorization': `token ${githubAPItoken}`
      }
    });
    try {
      issue = JSON.parse(issueRequest.getBody('utf8'));
    } catch (e) {
      errMsg = '[422] Github JSON malformed'
      return callback(new Error(errMsg))
    }
    // console.log('pr object', prData)
  }
  //console.log('issue object', issue)

  // set data to store to DB
  data.number = issue.number
  data.title = issue.title
  data.comments = issue.comments
  data.created_at = issue.created_at
  data.updated_at = issue.updated_at
  // data.id = issue.id
  // data.state = issue.state
  // data.html_url = issue.html_url
  // data.milestone = issue.milestone

  if (issue.labels && issue.labels.length) {
    console.log('has labels')
    const labelArray = issue.labels.map(function(label, i) {
      return {
        id: label.id,
        name: label.name,
        color: label.color
      }
    })
    data.labels = labelArray
  } else {
    console.log('no labels found')
    data.labels = issue.labels
  }

  if (issue.assignees && issue.assignees.length) {
    console.log('has assignees')
    const assigneeArray = issue.assignees.map(function(assignee, i) {
      return {
        login: assignee.login,
        id: assignee.id,
      }
    })
    data.assignees = assigneeArray
  } else {
    data.assignees = []
  }

  if (issue.milestone) {
    data.milestone = {
      number: issue.milestone.number,
      title: issue.milestone.title,
    }
  } else {
    console.log('no milestone')
    data.milestone = {}
  }

  console.log('data to update', data)

  if (issue.state === 'closed' || issue.closed_at) {
    console.log('Issue or PR closed. Remove from DB')
    var deleteParams = {
      TableName: 'status_board_open_issues',
      Key: {
        number: data.number
      },
    };
    db.delete(deleteParams, function(err, deletedResp) {
      if (err) {
        callback(err);
      }
      console.log('item deleted from status_board_open_issues', deletedResp)
      db.put({
        TableName: 'status_board_closed_issues',
        Item: data
      }, function(err, putResponse) {
        if (err) {
          callback(err);
        }
        console.log('item added to status_board_closed_issues', putResponse)
        const success = {
          statusCode: 200,
          body: JSON.stringify({
            input: event,
          }),
        };
        callback(null, success);
      });
    });
    // return false
    // remove issue.id
  } else {
    // add or update item in database
    var params = {
      TableName: 'status_board_open_issues',
      Item: data
    };

    db.put(params, function(err, putResponse) {
      if (err) {
        callback(err);
      }
      console.log('item added to status_board_open_issues')
      // check if in closed table and delete if so
      db.delete({
        TableName: 'status_board_closed_issues',
        Key: {
          number: data.number
        }
      }, function(err, deletedResp) {
        if (err) {
          callback(err);
        }
        console.log('item deleted from status_board_closed_issues')
        const addedResponse = {
          statusCode: 200,
          body: JSON.stringify({
            input: event,
          }),
        };
        callback(null, addedResponse);
      })
    });
  }
};


module.exports.getItems = (event, context, callback) => {
  db.scan({
    TableName: 'status_board_open_issues',
  }, function(err, items) {
    if (err) {
      callback(err);
    }
    console.log(items)
    const addedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      }),
    };
    callback(null, addedResponse);
  })
}

module.exports.getCompletedItems = (event, context, callback) => {
  db.scan({
    TableName: 'status_board_closed_issues',
  }, function(err, items) {
    if (err) {
      callback(err);
    }
    console.log(items)
    const addedResponse = {
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      }),
    };
    callback(null, addedResponse);
  })
}
