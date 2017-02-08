/**
 * Add issues/PRs to Dynamo to start
 */
const syncRequest = require('sync-request')
const parse = require('parse-link-header')
const formatIssue = require('./issueFormat')
const db = require('./db')
const REPO = process.env.REPO
const OPEN_ITEMS_TABLE = process.env.OPEN_ITEMS_TABLE
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
      // To get around github public API rate limits
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
      console.log('no more issues found, finish request')
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
    const items = issues.map((issue) => {
      return formatIssue(issue)
    })
    handleBatchInsert(OPEN_ITEMS_TABLE, items, function(err, data) {
      if (err) return callback(err)
      // return success
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          setup: 'complete',
          info: `Added ${items.length} items to table`
        }),
      })
    })
  })
}

/* batchUpdate loop for Dyanmo bulk modifications */
function handleBatchInsert(tableName, items, callback) {
  if (!items.length) {
    callback()
  }
  const insertItems = formatDynamoBatchInsert(items)
  // chunk items into 25 item arrays (Dynamo batch limit batchWrite)
  const batches = chunk(insertItems, 25)
  var params = {
    RequestItems: {},
    ReturnConsumedCapacity: "NONE",
    ReturnItemCollectionMetrics: "NONE"
  }
  var returnData = []
  var count = 0
  batches.forEach((batch, i) => {
    params.RequestItems[tableName] = batch
    db.batchWrite(params, function(e, data) {
      if (e) return callback(e)
      console.log(`batch ${i} complete. ${batch.length} items added to DB`)
      count++
      if (count === batches.length) {
        // last batch, callback and finish
        callback()
      }
    })
  })
}

/* Format dynamoDBItems for batch deletion  */
function formatDynamoBatchInsert(dynamoDBItems) {
  return dynamoDBItems.map((item)=> {
    return {
      PutRequest: {
        Item: item
      }
    }
  })
}

// array chunk util
function chunk(array, size) {
  var results = [];
  while (array.length) {
    results.push(array.splice(0, size));
  }
  return results;
}
