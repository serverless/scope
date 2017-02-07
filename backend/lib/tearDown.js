const db = require('./db')
const getOpenIssues = require('./getOpenIssues')
const getClosedIssues = require('./getClosedIssues')

module.exports.tearDown = function tearDown(event, context, callback) {

  getOpenIssues(null, null, function(err, data) {
    if (err) {
      return callback(err)
    }
    const items = JSON.parse(data.body).items
    const deleteItems = items.map((item)=> {
      return {
        DeleteRequest: {
          Key: {
            number: item.number
          }
        }
      }
    })
    // chunk items into 25 item arrays (Dynamo batch limit batchWrite)
    const batches = chunk(deleteItems, 25)
    // assemble batchWrite parameters
    var params = {
      RequestItems: {},
      ReturnConsumedCapacity: "NONE",
      ReturnItemCollectionMetrics: "NONE"
    }
    batches.forEach((batch) => {
      params.RequestItems[OPEN_ITEMS_TABLE] = batch
      console.log(JSON.stringify(params, null, 2))
      db.batchWrite(params, function(error, data) {
        if (error) {
          return callback(error)
        }
        console.log('batch delete done', data)
      })
    })
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        teardown: 'complete',
      }),
    })
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
