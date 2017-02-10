import getConfig from './get-config'

const config = getConfig()

export default function sortIssuesIntoColumns(issues) {
  // set initial reducer Object
  const initial = config.columns.reduce((prev, current, i) => {
     prev[current.title] = []
     return prev
  }, {
    assignees: {} // for sorting by assignees
  })
  // build Issue state object to send back to column renderer
  const dynamicIssues = issues.reduce((previousValue, currentValue) => {
    if (currentValue.assignees) {
      // for sorting by assignees
      currentValue.assignees.forEach((assignee) => {
        previousValue.assignees[assignee.login] = true
      })
    }
    if (currentValue.labels) {
      // get labels from Item
      const labels = currentValue.labels.map((label) => {
        return label.name
      })
      // loop over columns defined in config
      config.columns.forEach((column, i) => {
        var itemAdded = false
        labels.forEach((lab, j) => {

          if (column.githubTags.includes(lab) && !itemAdded) {
            itemAdded = true
            // Column has this tag configured. Add issue/pr to column
            previousValue[column.title].push(currentValue)
          }
        })
      })
    }
    return previousValue
  }, initial)

  return dynamicIssues
}
