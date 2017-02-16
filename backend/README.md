# Scope Serverless Backend

The backend of the status-board is driven by 3 lambda functions exposed through API Gateway with the [http event](https://serverless.com/framework/docs/providers/aws/events/apigateway/)

Watch the [Backend Video Tutorials](https://www.youtube.com/watch?v=YtYjx3Z5LLo&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=2) then the [Front-end Video Tutorials](https://www.youtube.com/watch?v=DXazDrLc2u4&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=5)

## Table of Contents
<!-- ⛔️ AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Click to expand</summary>
- [Configuration](#configuration)
- [Setup](#setup)
</details>
<!-- AUTO-GENERATED-CONTENT:END -->

![cloudcraft - status board webhook listener 1](https://cloud.githubusercontent.com/assets/532272/22728277/ead7cb00-ed91-11e6-98b4-98fdb36c58c2.png)

![cloudcraft - status board ui 2](https://cloud.githubusercontent.com/assets/532272/22728295/01f11e72-ed92-11e6-9db8-473874b3a713.png)

## Configuration

1. Duplicate `config.prod.example.json` into a file named `config.prod.json` and fill in your repositories values.

  <!-- AUTO-GENERATED-CONTENT:START (CODE:src=./config.prod.example.json) -->
  <!-- The below code snippet is automatically added from ./config.prod.example.json -->
  ```json
  {
    "region": "us-west-2",
    "REPO": "username/repoName",
    "GITHUB_WEBHOOK_SECRET": "xxxxx",
    "GITHUB_API_TOKEN": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "GITHUB_USERNAME": "YourGithubUserName"
  }
  ```
  <!-- AUTO-GENERATED-CONTENT:END -->

2. You will also need to update `ADD_YOUR_REPO_NAME_HERE` in the `serverless.yml` file.

  ```yml
  custom:
    repoName: ADD_YOUR_REPO_NAME_HERE
  ```

  Example:

  ```yml
  custom:
    repoName: serverless
  ```

## Setup

After you [added your values](#Configuration) to the newly created `config.prod.json` file, you are ready to deploy!

0. Run `npm install` to install the dependancies

1. Run `serverless deploy` and wait for the stack to be created

  [Watch the Backend configuration video](https://www.youtube.com/watch?v=dbfTNYgWIuI&index=2&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3)

2. Copy the API urls to use in the frontend portion of the application

3. Populate the initial data for your status board with

  `serverless invoke -f setup`

  This will pull in the open issues from your repository for the initial data. This only needs to be run once.

4. Setup your github webhook in your repositories settings

  [Watch the webhook setup  video](https://www.youtube.com/watch?v=b_DVXgiByec&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=3)

  ![webhook-instructions-post](https://cloud.githubusercontent.com/assets/532272/22728139/3275dbba-ed91-11e6-8331-7e5778694ecf.jpg)

5. Plug in your API endpoints to the front-end application

  To get those API endpoints again type:
  ```bash
  serverless info
  ```

  Head over into `../frontend/src/custom.config.js` and plugin the API endpoints

  [Watch the front-end setup  video](https://www.youtube.com/watch?v=DXazDrLc2u4&list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3&index=4)

6. (optional) You can seed your initial issues/prs by running

  ```
  sls invoke -f setup
  ```

---

[Website](http://www.serverless.com) • [Email Updates](http://eepurl.com/b8dv4P) • [Gitter](https://gitter.im/serverless/serverless) • [Forum](http://forum.serverless.com) • [Meetups](https://github.com/serverless-meetups/main) • [Twitter](https://twitter.com/goserverless) • [Facebook](https://www.facebook.com/serverless) • [Contact Us](mailto:hello@serverless.com)
