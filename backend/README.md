# Backend

The backend of the status-board is driven by 3 lambda functions exposed through API Gateway with the [http event](https://serverless.com/framework/docs/providers/aws/events/apigateway/)

## Configuration

Duplicate `config.prod.example.json` into a file named `config.prod.json` and fill in your repositories values.

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

- **region** - the AWS region you would like to deploy to. [See full list here](http://docs.aws.amazon.com/general/latest/gr/rande.html#apigateway_region)
- **REPO** - your repo's orgName/repoName. Example [serverless/serverless](http://github.com/serverless/serverless)
- **GITHUB_WEBHOOK_SECRET** - any random string of text you want to verify your webhook is coming from github. `blahblahblahMySecret`
- **GITHUB_API_TOKEN** - If you run the setup function (not required), you could run into github rate limits, this will make sure you don't
- **GITHUB_USERNAME** - Your github username. Needed for an additional request to get label data from PR activity

<!-- AUTO-GENERATED-CONTENT:END -->

## Setup

After you have plugged in your values to `config.prod.json`

1. Run `serverless deploy` and wait for the stack to be created

2. Copy the API urls to use in the frontend portion of the application

3. Populate the initial data for your status board with

  `serverless invoke -f setup`

  This will pull in the open issues from your repository for the initial data. This only needs to be run once.

4. Setup your github webhook in your repositories settings

  image
  image

5. Plug in your API endpoints to the frontend application

  To get those API endpoints again type:
  ```bash
  serverless info
  ```

  Head over into `../frontend/src/config.js` and plugin the API endpoints



## TODO:

- [] optimize getCompletedIssues query http://www.it1me.com/it-answers?id=35963243&ttl=How+to+query+DynamoDB+by+date+(range+key)%2C+with+no+obvious+hash+key%3F
