/**
 * Format github issue for storage in DynamoDB
 */
module.exports = function formatIssue(issue) {
  const isPullRequest = issue && issue.pull_request
  const type = (isPullRequest) ? 'pull-request' : 'issue'
  // set default labels. Default: []
  var labels = issue.labels
  if (issue.labels && issue.labels.length) {
    labels = issue.labels.map((label) => {
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
  var issueToSave = {
    type: type,
    number: issue.number,
    title: issue.title,
    comments: issue.comments,
    state: issue.state,
    // store time as Unix
    updated_at: new Date(issue.created_at).getTime(),
    created_at: new Date(issue.updated_at).getTime(),
    // store additional issue info
    milestone: milestone,
    assignees: assignees,
    labels: labels,
    //id: issue.id
  }
  if (issue.closed_at) {
    issueToSave.closed_at = new Date(issue.closed_at).getTime()
  }

  return issueToSave
}
