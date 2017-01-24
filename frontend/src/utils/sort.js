import getConfig from './get-config'

const config = getConfig()

export default function sortIssuesIntoColumns(issues) {
  // set initial reducer Object
  const initial = config.columns.reduce((prev, current, i) => {
     prev[current.title] = []
     return prev
  }, {})
  // build Issue state object to send back to column renderer
  const dynamicIssues = issues.reduce((previousValue, currentValue) => {
    if (currentValue.labels) {
      // get labels from Item
      const labels = currentValue.labels.map((label) => {
        return label.name
      })
      // loop over columns defined in config
      config.columns.forEach((column, i) => {
        // console.log('column', column)
        const normalizeTags = column.githubTags.map((tag) => {
          if (typeof tag === 'string') {
            return tag
          }
          if (typeof tag === 'object') {
            return tag.name
          }
        })
        // console.log('normalizeTags', normalizeTags)
        var itemAdded = false
        labels.forEach((lab, j) => {

          if (normalizeTags.includes(lab) && !itemAdded) {
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
