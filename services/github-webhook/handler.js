
module.exports.githubWebhookListener = (event, context, callback) => {
  console.log(event)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };
  callback(null, response);
};
