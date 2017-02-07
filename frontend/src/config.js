/** Configuration for the frontend of the status-board */

module.exports = () => {
  return {
    // Set the react mount node you want to use
    mountNodeID: 'status-board',
    // Set your repo userName/repoName
    repo: 'serverless/serverless',
    // Override the styles of the board
    theme: {
      backgroundColor: '#191919',
      /**  default #fff */
      columnHeadingColor: '#fff',
      // #9e9e9e
      columnCountColor: '#9e9e9e',
      //  #fff
      cardTextColor: '#000',
      // cardTextColor: '#fff',
      // #353535
      cardBackgroundColor: '#eee',
      // cardBackgroundColor: '#353535',
    },
    // Set your API endpoints
    api: {
      open: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/issues',
      completed: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/completed'
    },
    // Show or hide completed column
    recentlyCompleted: {
      show: true
    },
    // Set column sort order. 'updated_at', 'created_at', 'comments', 'milestone'
    sortBy: 'updated_at',
    // Set column sort order. 'asc' or 'desc'
    sortOrder: 'desc',
    // Keep Milestones at top of column
    stickyMilestones: false,
    // configure columns
    columns: [
      {
        // Add a title to a given column
        title: "discussing",
        // Include the github tags you want to display in the column
        githubTags: [
          'kind/enhancement',
          'kind/feature',
          'kind/question',
          'stage/needs-feedback',
          'status/needs-attention'
        ],
      },
      {
        title: "waiting",
        githubTags: [
          'status/more-info-needed',
        ]
      },
      {
        title: "coding",
        githubTags: [
          'stage/accepted',
          'stage/in-progress',
        ]
      },
      {
        title: "reviewing",
        githubTags: [
          'stage/in-review',
        ]
      },
    ],
    /** These are the visible ribbons on cards. You can customize these per tag if you wish */
    ribbons: {
      'kind/bug': {
          text: 'Bug',
          textColor: '#fff',
          backgroundColor: '#f05656'
      },
      'status/help-wanted': {
          text: 'Help wanted',
          textColor: '#fff',
          backgroundColor: '#38912c'
      },
      'status/easy-pick': {
          text: 'Easy Pick',
          textColor: '#fff',
          backgroundColor: '#3FA731'
      },
    },
    // set to true to debug sorting
    debug: false,
  }
}
