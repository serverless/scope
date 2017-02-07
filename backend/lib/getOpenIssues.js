const db = require('./db')
const OPEN_ITEMS_TABLE = process.env.OPEN_ITEMS_TABLE

module.exports = (event, context, callback) => {
  db.scan({
    TableName: OPEN_ITEMS_TABLE,
  }, function(err, items) {
    if (err) return callback(err)

    return callback(null, {
      headers: {
         // Required for CORS support to work
        "Access-Control-Allow-Origin" : "*",
        // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Credentials" : true
      },
      statusCode: 200,
      body: JSON.stringify({
        items: items,
      })
    })
  })
}
