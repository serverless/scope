
export default function sortIssuesIntoColumns(issues) {
  const discussingItems = []
  const waitingItems = []
  const codingItems = []
  const reviewingItems = []

  const discussingTags = [
    'kind/enhancement',
    'kind/feature',
    'kind/question',
    'stage/needs-feedback',
    'status/needs-attention'
  ]

  const waitingTags = [
    'status/0-triage',
    'status/more-info-needed',
  ]

  const codingTags = [
    'stage/accepted',
    'stage/in-progress',
  ]

  const reviewingTags = [
    'stage/in-review',
  ]

  for (var i = 0; i < issues.length; i++) {
    // console.log(body.items[i])
    const item = issues[i]
    const labels = issues[i].labels
    if (labels) {
      // console.log('labels', labels.length)
      for (var j = 0; j < labels.length; j++) {
        const labelName = labels[j].name // eslint-disable-line
        // console.log('labelName', labelName)
        if (discussingTags.includes(labelName)) {
          discussingItems.push(item)
        }
        if (waitingTags.includes(labelName)) {
          waitingItems.push(item)
        }
        if (codingTags.includes(labelName)) {
          codingItems.push(item)
        }
        if (reviewingTags.includes(labelName)) {
          reviewingItems.push(item)
        }
      }
    }
  }
  return {
    discussingItems: discussingItems,
    waitingItems: waitingItems,
    codingItems: codingItems,
    reviewingItems: reviewingItems,
  }
}