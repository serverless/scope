import React, { Component } from 'react';
import Column from './components/Column/Column'
import styles from './StatusBoard.css'
import api from './utils/api'

/*
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp*1000);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
*/

export default class StatusBoard extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      discussingItems: [],
      waitingItems: [],
      codingItems: [],
      reviewingItems: [],
    }
  }
  changeView = (e) => {
    console.log(e.target.dataset)
  }
  componentDidMount() {
    api.getCompleted().then((items) => {
      this.setState({
        completedItems: items,
      })
    });
    api.getOpenIssues().then((sortedItems) => {
      this.setState(sortedItems)
    })
  }
  render() {
    const {
      discussingItems,
      waitingItems,
      codingItems,
      reviewingItems,
      completedItems
    } = this.state
    return (
      <div className={styles.container}>
        <div className={styles.list}>
          <Column title='discussing' items={discussingItems} />
          <Column title='waiting' items={waitingItems} />
          <Column title='coding' items={codingItems} />
          <Column title='reviewing' items={reviewingItems} />
          <Column title='recently completed' items={completedItems} />
        </div>
        <div className={styles.mobileSwitcher}>
            <span
              data-column="1"
              onClick={this.changeView}
              className={styles.item}
            >
              Discussing
            </span>
            <span
              data-column="2"
              onClick={this.changeView}
              className={styles.item}
            >
              Waiting
            </span>
            <span
              data-column="3"
              onClick={this.changeView}
              className={styles.item}
            >
              Coding
            </span>
            <span
              data-column="4"
              onClick={this.changeView}
              className={styles.item}
            >
              Reviewing
            </span>
            <span
              data-column="5"
              onClick={this.changeView}
              className={styles.item}
            >
              Completed
            </span>
        </div>
      </div>
    );
  }
}

