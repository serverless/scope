const crypto = require('crypto')

function signRequestBody (key, body) {
  return 'sha1=' + crypto.createHmac('sha1', key).update(body).digest('hex')
}

module.exports.githubWebhookListener = (event, context, callback) => {
  let errMsg
  const token = process.env.GITHUB_WEBHOOK_SECRET
  if (typeof token !== 'string') {
    errMsg = '[401] must provide a \'GITHUB_WEBHOOK_SECRET\' env variable'
    return callback(new Error(errMsg))
  }
  console.log(event)
  const headers = event.headers
  const sig = headers['X-Hub-Signature']
  const githubEvent = headers['X-GitHub-Event']
  const id = headers['X-GitHub-Delivery']
  const calculatedSig = signRequestBody(token, JSON.stringify(event.body))


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

  if (sig !== calculatedSig) {
    errMsg = '[401] X-Hub-Signature incorrect. Github webhook token doesn\'t match'
    return callback(new Error(errMsg))
  }

  /*
  try {
    obj = JSON.parse(data.toString())
  } catch (e) {
    return hasError(e)
  }
  var emitData = {
    event: event,
    id: id,
    payload: obj,
    protocol: req.protocol,
    host: req.headers['host'],
    url: req.url,
  }
  */

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };
  callback(null, response);
};
