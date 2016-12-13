## Custom Roadmap Application

![roadmap2](https://cloud.githubusercontent.com/assets/532272/21120332/991edc10-c07b-11e6-9c18-2bc425f87da2.png)

## Specs

* Use labels to indicate status, bugs and help-wanted, that's all.
* Write a Lambda that re-populates a dynamoDB table every 5 minutes with Github issues by label, via the Github API.
* Write another Lambda with a REST API endpoint which you can use to fetch issues by label.
* Build a front-end Github Project/Trello/Kanban app that exists on our website and displays everything.
* The road map will auto-update every 5 minutes according to whatever labels are on issues, and everything will be put into the appropriate column.
* The items in each column should be sorted by milestone. Later or no milestone issues should be pushed to the bottom.

## Future wishlist

* The voting feature in the mock-up should not be implemented at this time.

## Running the Frontend

`cd frontend && npm start`