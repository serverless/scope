# Scope - Serverless Open Source Status Board

Scope is a customizable birdeye's view of your open source project.

Built using event driven serverless tech, the application can be cloned down & deployed for your open source project in minutes.

Deploy it as a stand-alone application or embed it directly into your project's site.

Run it for **[free](https://aws.amazon.com/free/)** under AWS's generous free tier.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

<!-- AUTO-GENERATED-CONTENT:END -->

### Features:

- Look mom! No servers!
- Avoid github rate limiting via event driven webhooks
- Customizable styles 💁
- Map your projects tags into the columns you want

Map your projects github labels to columns of your choosing and have them automatically update.

## Why?

We built this tool for our community to help keep people up to speed with what is happening with the serverless project & to highlight places where we actively want feedback + collaboration.

- Quickly sort and see high priority issues & Pull requests
- Call out which issues need attention from your community
- Zoom into important aspect of your open source project

Diagram here

GIF demo with link to YouTube video

[Front-end Documentation & setup](./backend/README.md)

[Backend Documentation & setup](./backend/README.md)

# Contributing

Want to contribute back to the project? Drop an issue or open up a PR.

## Setup

1. Deploy the serverless Backend. [Follow these instructions](./backend/README.md)

2. Grab your API endpoints & plug them into the front-end in `/frontend/src/custom.config.js`

3. Configure the front-end columns with your projects labels, build and deploy it. [Follow these instructions](./frontend/README.md)

## FAQ

**Do I need an AWS account for this to work?**

Yes, but this will fall into the free tier of an AWS account. [Free tier Signup](https://aws.amazon.com/free/)

**Does it need to show all my issues?**

Nope. You choose what labels show up in each column

**Do I have to show recently completed items?**

Nope. You can toggle off that column in the front-end config.

**I just setup the front-end, where are the recently completed items?**

They will start flowing in once you start closing issues/PRs in your repo
