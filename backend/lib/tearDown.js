const db = require('./db')
const getOpenIssues = require('./getOpenIssues')
const getClosedIssues = require('./getClosedIssues')
const CLOSED_ITEMS_TABLE = process.env.CLOSED_ITEMS_TABLE
const OPEN_ITEMS_TABLE = process.env.OPEN_ITEMS_TABLE

module.exports = function tearDown(event, context, callback) {
  // Batch delete items from both tables
  tearDownOpenIssues((err, data) => {
    if (err) return callback(err)
    tearDownClosedIssues((e, data) => {
      if (e) return callback(e)
      // sucess return complete
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          teardown: 'complete',
        }),
      })
    })
  })
}

function tearDownOpenIssues(callback) {
  getOpenIssues(null, null, function(err, data) {
    if (err) return callback(err)

    const items = JSON.parse(data.body).items
    handleBatchDeletes(OPEN_ITEMS_TABLE, items, function(err, data) {
      if (err) return callback(error)
      // return success
      return callback(null, data)
    })
  })
}

function tearDownClosedIssues(callback) {
  getClosedIssues(null, null, function(err, data) {
    if (err) return callback(err)

    const items = JSON.parse(data.body).items
    handleBatchDeletes(CLOSED_ITEMS_TABLE, items, function(err, data) {
      if (err) return callback(error)
      // return success
      return callback(null, data)
    })
  })
}

/* batchUpdate loop for Dyanmo bulk modifications */
function handleBatchDeletes(tableName, items, callback) {
  const deleteItems = formatDynamoBatchDelete(items)
  // chunk items into 25 item arrays (Dynamo batch limit batchWrite)
  const batches = chunk(deleteItems, 25)
  var params = {
    RequestItems: {},
    ReturnConsumedCapacity: "NONE",
    ReturnItemCollectionMetrics: "NONE"
  }
  var returnData = []
  batches.forEach((batch, i) => {
    params.RequestItems[tableName] = batch
    db.batchWrite(params, function(error, data) {
      if (error) return callback(error)
      console.log(`batch update ${i} complete`, data)
    })
  })
  callback(null)
}

/* Format dynamoDBItems for batch deletion  */
function formatDynamoBatchDelete(dynamoDBItems) {
  return dynamoDBItems.map((item)=> {
    return {
      DeleteRequest: {
        Key: {
          number: item.number
        }
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
