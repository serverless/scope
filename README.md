## Open Source Status Board

The serverless open source status board is a customizable bird eye view of your github repository.

Built using event driven serverless tech, the application can be cloned down and deployed for your open source project in minutes.

### Features:

- no servers!
- no github rate limiting
- Customizable columns
- Customizable color scheme
- Customizable visible labels on cards

Map your projects github labels to columns of your choosing and have them automatically update.

## Why?

We built this tool for our community to help keep people up to speed with what is happening at a higher level and highlight where we actively want feedback.

Diagram here

GIF demo with link to YouTube video

Frontend docs link here

Backend docs link here

# Contributing

Want to contribute back to the project? Drop an issue or open up a PR.

## Setup

1. Deploy the serverless Backend. [Follow these instructions](./backend/README.md)

2. Grab your API endpoints and plug them into the frontend

3. Deploy the frontend to amazon s3

  Alter the package.json `dist` script to point to your bucket of choice

  ```json
    "dist": "node scripts/dist.js --bucket=your.bucket.name.here --path=your/bucket/path",
  ```

  Then run `npm run dist` and it will upload the status board to your bucket and return a url for you to use on your site.

4. Include script on your site!

  ```html
  <script src="http://your-bucket-url.com/status-board-loader.js"></script>
  ```

  If you are making updates to your config in the frontend or backend this script URL never needs to change, the `dist` command takes care of repacking the script and updating the `loader.js`

5. Profit


## Running the Backend

1. Rename `config.prod.example.json` to `config.prod.json`
2. Add github tokens
3. Deploy from `/services/` directory

```
sls deploy
```

## Running the Frontend

`cd frontend && npm start`

## Future wishlist

* The voting feature in the mock-up should not be implemented at this time.
