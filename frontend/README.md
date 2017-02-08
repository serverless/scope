# Scope Front-end

The status board front-end is fully configurable to suite your projects needs.

Watch the [Backend Video Tutorials](https://www.youtube.com/watch?v=YtYjx3Z5LLo&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=2) first, then follow on with the [Front-end Video Tutorials](https://www.youtube.com/watch?v=DXazDrLc2u4&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=5)

## Table of Contents
<!-- ⛔️ AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Click to expand</summary>
- [Tech used](#tech-used)
- [Install](#install)
- [Configuration](#configuration)
- [Default settings](#default-settings)
- [Deploy](#deploy)
  * [1. Deploying stand alone app](#1-deploying-stand-alone-app)
  * [2. Deploying embeddable app](#2-deploying-embeddable-app)
- [Reloading for Ajax/Router driven sites](#reloading-for-ajaxrouter-driven-sites)
</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Tech used

- React
- PostCSS
- Axios for AJAX requests
- Serverless for the backend API

## Install

1. `npm install` install the deps

2. Then run with `npm start`

The UI files are located in `/src`

## Configuration

Alter the `src/custom.config.js` file to define override any of the default settings

## Default settings

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./src/default.config.js) -->
<!-- The below code snippet is automatically added from ./src/default.config.js -->
```js
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
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Deploy

There are two ways to deploy the site.

1. You can deploy the full static app
2. You can just deploy the script and embed this on your site

### 1. Deploying stand alone app

1. Run `npm run build`

2. The frontend application is built and ready to go. `cd` into the `build` folder and you can deploy this html + js to your static host of choice.

### 2. Deploying embeddable app

This is my preferred option and is what is running on [the serverless status page](https://serverless.com/framework/status/)

1. Run `npm run build`

2. Make sure you configured your `bucketName` and `bucketPath` in `src/custom.config.js` then run `npm run dist`

  ```html
  <script src="http://your-bucket-url.com/status-board-loader.js"></script>
  ```

3. Embed the script on your site and include the mountNode for the statusBoard to load

  ```html
  <div id='status-board'></div>
  ```

4. Profit

## Reloading for Ajax/Router driven sites

```
if (typeof window.statusBoardReload !== 'undefined') {
  console.log('reload from app');
  window.statusBoardReload();
}
```
