import React, { Component } from 'react';
import Column from './components/Column/Column'
import styles from './Roadmap.css'
import axios from 'axios'
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

class Roadmap extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      discussingItems: [],
      waitingItems: [],
      codingItems: [],
      reviewingItems: [],
    }
  }
  componentDidMount() {
    const discussingItems = []
    const waitingItems = []
    const codingItems = []
    const reviewingItems = []

    const discussingMatch = [
      'kind/enhancement',
      'kind/feature',
      'kind/question',
      'status/needs-attention'
    ]

    const waitingMatch = [
      'status/0-triage',
      'status/more-info-needed',
    ]

    const codingMatch = [
      'status/accepted',
      'status/confirmed',
    ]

    const reviewingMatch = [
      'status/1-design-review',
      'status/2-code-review',
      'status/3-docs-review',
    ]

    axios({
      method: 'get',
      url: 'https://xu5ip83smg.execute-api.us-east-1.amazonaws.com/dev/issues',
    }).then((response) => {
      console.log('404 recorded')
      console.log(response)
      const body = JSON.parse(response.data.body)
      if (body.items) {
        for (var i = 0; i < body.items.length; i++) {
          console.log(body.items[i])
          const item = body.items[i]
          const labels = body.items[i].labels
          if (labels) {
            console.log('labels', labels.length)
            for (var j = 0; j < labels.length; j++) {
              const labelName = labels[j].name
              if (discussingMatch.includes(labelName)) {
                discussingItems.push(item)
              }
              if (waitingMatch.includes(labelName)) {
                waitingItems.push(item)
              }
              if (codingMatch.includes(labelName)) {
                codingItems.push(item)
              }
              if (reviewingMatch.includes(labelName)) {
                reviewingItems.push(item)
              }
            }
          }
        }
        this.setState({
          discussingItems: discussingItems,
          waitingItems: waitingItems,
          codingItems: codingItems,
          reviewingItems: reviewingItems,
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  render() {
    const { discussingItems, waitingItems, codingItems, reviewingItems } = this.state
    return (
      <div className={styles.roadmap}>
        <div className="drag-list">
          <Column title='discussing' items={discussingItems} />
          <Column title='waiting' items={waitingItems} />
          <Column title='coding' items={codingItems} />
          <Column title='reviewing' items={reviewingItems} />
          <Column title='recently completed' />
          <div className='mobile-switcher'>
              <span className='mobile-switcher-item'>Discussing</span>
              <span className='mobile-switcher-item'>Waiting</span>
              <span className='mobile-switcher-item'>Coding</span>
              <span className='mobile-switcher-item'>Reviewing</span>
              <span className='mobile-switcher-item'>Completed</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Roadmap;
