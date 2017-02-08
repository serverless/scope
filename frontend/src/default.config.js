/* Add your custom configuration/overides to custom.config.js */
const customConfig = require('./custom.config')()

module.exports = () => {
  const defaults = {
    /** Set the react mount node you want to use */
    mountNodeID: 'status-board',
    /** Set your repo userName/repoName */
    repo: 'serverless/serverless',
    /** Override the styles of the board */
    theme: {
      /** Color of the board's background */
      backgroundColor: '#191919',
      /** Color of the column header labels */
      columnHeadingColor: '#fff',
      /** Color of the column header (count) label */
      columnCountColor: '#9e9e9e',
      /** Background color of the cards in the columns */
      cardBackgroundColor: '#eee',
      /** Text color and icon color of the cards in the columns */
      cardTextColor: '#000',
    },
    /** Set your API endpoints returned from the backend deployment here */
    api: {
      // open: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/issues',
      // completed: 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com/dev/completed'
      open: 'https://9985hyiut1.execute-api.us-west-2.amazonaws.com/prod/open',
      completed: 'https://9985hyiut1.execute-api.us-west-2.amazonaws.com/prod/closed'
    },
    /** Recently completed column settings */
    recentlyCompleted: {
      /** Set to false to hide recently completed column */
      show: true
    },
    /** Set column sort order. 'updated_at', 'created_at', 'comments', 'milestone' */
    sortBy: 'updated_at',
    /** Set column sort order. 'asc' or 'desc' */
    sortOrder: 'desc',
    /** Keep Milestones at top of column */
    stickyMilestones: false,
    /** Configure your github labels to map into columns here */
    columns: [
      {
        /** Column title */
        title: "discussing",
        /** Github labels to show in this column */
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
    /** Visible ribbons on cards. You can customize these per tag if you wish */
    ribbons: {
      /** Github label to match. 'kind/bug' */
      'kind/bug': {
          /** Visible text in ribbon */
          text: 'Bug',
          /** Text color of this ribbon */
          textColor: '#fff',
          /** Background color of this ribbon */
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
    /**
     * Optionally you can extern React if you already have it running globally on your site
     * This will shrink the build and use your sites window.React and window.ReactDOM
     */
    excludeReact: false,
    /** Add your bucket name here to deploy the script */
    bucketName: 'assets.site.serverless.com',
    /**
     *  Add your bucket path here to deploy the script.
     *  Our scripts will live in the assets.site.serverless.com/apps/status-board s3 bucket
     */
    bucketPath: 'apps/status-board',
    /** set to true to debug sorting */
    debug: false,
  }

  if (customConfig.columns) {
    // don't merge from defaults
    delete defaults.columns
  }

  if (customConfig.ribbons) {
    // don't merge from defaults
    delete defaults.ribbons
  }

  return require('deepmerge')(defaults, customConfig)
}
