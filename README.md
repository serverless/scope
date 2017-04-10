<p align="center">
  <img width="800" height="352" src="https://cloud.githubusercontent.com/assets/532272/22727205/6f4d658a-ed8c-11e6-8921-8baf70f011e0.jpg">
</p>

# Scope - Serverless Open Source Status Board</h1>

Scope is a customizable bird's eye view of your Github project.

It automatically pulls in issues & Pull requests and sorts them into columns you define. Think github projects on steroids.

Built using event driven serverless tech, the application can be cloned down, configured, & deployed for your project in minutes.

Deploy it as a stand-alone application or embed it directly into your project's site.

Run it for **[free](https://aws.amazon.com/free/)** under AWS's generous free tier.

## Table of Contents
<!-- ⛔️ AUTO-GENERATED-CONTENT:START (TOC:collapse=true&collapseText=Click to expand) -->
<details>
<summary>Click to expand</summary>
- [Features](#features)
- [Why we built it](#why-we-built-it)
- [Contributing](#contributing)
- [Setup](#setup)
- [FAQ](#faq)
</details>
<!-- AUTO-GENERATED-CONTENT:END -->

## Features

<img align="right" width="391" height="218" src="https://cloud.githubusercontent.com/assets/532272/22727459/cad63336-ed8d-11e6-8924-fce36f239a84.gif">

- Customize the labels/columns to fit your project
- Customizable styles 💁
- Driven by push based Github webhooks
- Run as standalone app or Embed on your project's site
- Look mom! No servers!

Data automatically updates when activity happens in your repository and your status board will reflect the latest state of your project.

## Why we built it

We built this tool for our community to help keep people up to speed with what is happening with the serverless project & to highlight places where we actively want feedback + collaboration.

- Quickly sort and see high priority issues & Pull requests
- Call out which issues need attention from your community
- Zoom into important aspect of your open source project

[Front-end Documentation & setup](./frontend/README.md)

[Backend Documentation & setup](./backend/README.md)

[Video Tutorials](https://www.youtube.com/playlist?list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3)

# Contributing

Want to contribute back to the project? Drop an issue or open up a PR.

## Setup

**First things first** 👉 [Setup your AWS account](https://youtu.be/HSd9uYj2LJA) and `npm i serverless -g` to be able to deploy your status board

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

---

[Website](http://www.serverless.com) • [Email Updates](http://eepurl.com/b8dv4P) • [Gitter](https://gitter.im/serverless/serverless) • [Forum](http://forum.serverless.com) • [Meetups](https://github.com/serverless-meetups/main) • [Twitter](https://twitter.com/goserverless) • [Facebook](https://www.facebook.com/serverless) • [Contact Us](mailto:hello@serverless.com)
