/**
 * Save github issue in DynamoDB
 */
const db = require('./db')
const CLOSED_ITEMS_TABLE = process.env.CLOSED_ITEMS_TABLE
const OPEN_ITEMS_TABLE = process.env.OPEN_ITEMS_TABLE
const DEBUG = process.env.DEBUG

module.exports = function saveSingleIssue(issue, callback) {
  if (issue.state === 'closed' || issue.closed_at) {
    // add to closed database and remove from open issues
    saveClosedIssue(issue, callback)
  } else {
    // add to open database and remove from closed issues
    saveOpenIssue(issue, callback)
  }
}

function saveClosedIssue(issue, callback) {
  console.log('Issue or PR closed. Remove from DB')
  db.delete({
    TableName: OPEN_ITEMS_TABLE,
    Key: {
      number: issue.number
    },
  }, (err, resp) => {
    if (err) return callback(err)
    if (DEBUG) {
      console.log(`issue ${issue.number} deleted from ${OPEN_ITEMS_TABLE} Table`, resp)
    }
    db.put({
      TableName: CLOSED_ITEMS_TABLE,
      Item: issue
    }, function(error, response) {
      if (error) return callback(error)
      if (DEBUG) {
        console.log(`issue ${issue.number} added to ${CLOSED_ITEMS_TABLE} Table`, response)
      }
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          input: response,
        }),
      })
    })
  })
}

function saveOpenIssue(issue, callback) {
  // add or update item in database
  db.put({
    TableName: OPEN_ITEMS_TABLE,
    Item: issue
  }, (err, resp) => {
    if (err) return callback(err)
    if (DEBUG) {
      console.log(`issue ${issue.number} added to ${OPEN_ITEMS_TABLE} Table`, resp)
    }
    // Delete from closed table if it's being reopened
    db.delete({
      TableName: CLOSED_ITEMS_TABLE,
      Key: {
        number: issue.number
      }
    }, function(err, response) {
      if (err) return callback(err)
      if (DEBUG) {
        console.log(`issue ${issue.number} deleted from ${CLOSED_ITEMS_TABLE} Table`, response)
      }

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          input: response,
        })
      })
    })
  })
}
