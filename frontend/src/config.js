module.exports = {
  theme: {
    backgroundColor: '#1a1a1a',
  },
  // Set your repo userName/repoName
  repo: 'serverless/serverless',
  // Set your API endpoints
  api: {
    open: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/issues',
    completed: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/completed'
  },
  // Show or hide completed column
  recentlyCompleted: {
    show: true,
    timeRange: 'xyz'
  },
  // Set column sort order. 'updated_at', 'created_at', 'comments'
  sortBy: 'updated_at',
  // Set column sort order. 'asc' or 'desc'
  sortOrder: 'desc',
  // Milestones at top of column
  sortMilestonesFirst: false,
  // configure columns
  columns: [
    {
      title: "discussing",
      mobileToggleTitle: "Discussing",
      githubTags: [
        'kind/enhancement',
        'kind/feature',
        'kind/question',
        'stage/needs-feedback',
        'status/needs-attention'
      ],
    },
    // {
    //   title: "question",
    //   mobileToggleTitle: "question",
    //   githubTags: [
    //     'kind/question',
    //   ]
    // },
    {
      title: "waiting",
      mobileToggleTitle: "Waiting",
      githubTags: [
        'status/0-triage',
        'status/more-info-needed',
      ]
    },
    {
      title: "coding",
      mobileToggleTitle: "Coding",
      githubTags: [
        'stage/accepted',
        'stage/in-progress',
      ]
    },
    {
      title: "reviewing",
      mobileToggleTitle: "Reviewing",
      githubTags: [
        'stage/in-review',
      ]
    },
  ],
}