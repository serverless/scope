import React, {Component, PropTypes} from 'react'
import CommentIcon from '../Comment/Comment'
import MilestoneIcon from '../Milestone/Milestone'
import config from '../../config'
import { githubIssueURL, githubUserImage } from '../../utils/github-urls'
import styles from './Column.css'

const propTypes = {
  children: PropTypes.any
}

function sortDate(dateType, order) {
  return function (a, b) {
    const timeA = new Date(a[dateType]).getTime()
    const timeB = new Date(b[dateType]).getTime()
    if (order === 'asc') {
      return timeA - timeB
    }
    // default 'desc' descending order
    return timeB - timeA
  }
}

function sortComments(order) {
  return function (a, b) {
    if (order === 'asc') {
      if (a.comments < b.comments) return -1
      if (a.comments > b.comments) return 1
    }
    if (a.comments > b.comments) return -1
    if (a.comments < b.comments) return 1
    return 0
  }
}

function sortMileStones(a, b) {
  if (a.milestone && b.milestone) {
    let A = parseFloat(a.milestone.title)
    let B = parseFloat(b.milestone.title)
    if(isNaN(A)) {
      A = Infinity // no milestone push to end
    }
    if(isNaN(B)) {
      B = Infinity // no milestone push to end
    }
    if (A < B) return -1
    if (A > B) return 1
  }
  return 0
}

export default class Column extends Component {
  renderItems() {
    const { items, sortOrder, sortBy, stickyMilestones } = this.props
    if (!items) {
      return null
    }

    let order
    if (sortBy === 'updated_at') {
      order = sortDate(sortBy, sortOrder)
    } else if (sortBy === 'created_at') {
      order = sortDate(sortBy, sortOrder)
    } else if (sortBy === 'comments') {
      order = sortComments(sortOrder)
    }

    let columnItems = items

    if (stickyMilestones) {
      const milestoneItems = items.filter((item) => {
         return item.milestone && item.milestone.title
      }).sort(order).sort(sortMileStones)

      const nonMileStones = items.filter((item) => {
         return item.milestone && !item.milestone.title
      }).sort(order)
      columnItems = milestoneItems.concat(nonMileStones)
    } else {
      columnItems = items.sort(order)
    }

    // sort and render
    return columnItems.map((item, i) => {
      const githubURL = githubIssueURL(item.number, config.repo)
      let hasVisibleLabel = false
      let assigneeRender
      if (item.assignees && item.assignees.length) {
        // console.log('assignee', item.assignees)
        const spacing = (item.assignees.length > 1) ? styles.multiplePeople : ''
        const assigneeDivs = item.assignees.map((person, j) => {
          // console.log(person)
          return (
            <div key={j} className={styles.assignee + ' ' + spacing}>
              <div className={styles.image}>
                <img role="presentation" src={githubUserImage(person.id, 20)}/>
              </div>
              <div className={styles.name}>
                {person.login}
              </div>
            </div>
          )
        })
        assigneeRender = (
          <div className={styles.assigneeContainer}>
            {assigneeDivs}
          </div>
        )
      }
      let hasMilestoneClass
      let milestone = item.milestone.title
      if (item.milestone && item.milestone.title) {
        hasMilestoneClass = styles.hasMilestone
        const mileNumber =item.milestone.number
        milestone = (
          <span className={styles.milestone}>
            <a
              className={styles.milestoneLink}
              title={`View Milestone ${item.milestone.title} on github`}
              target='_blank'
              href={`https://github.com/${config.repo}/milestone/${mileNumber}`}
            >
             <div className={styles.milestoneIcon}>
              <MilestoneIcon />
             </div>
             <div className={styles.milestoneNumber}>
              {item.milestone.title}
             </div>
            </a>
          </span>
        )
      }
      let tag
      if (item.labels && item.labels.length) {
        // console.log(item.labels)
        item.labels.forEach((l) => {

          if(l.name === 'kind/bug') {
            hasVisibleLabel = true
            tag = (
              <span className={styles.label + ' ' + styles.bug}>
                <div className={styles.inner}>
                  <div className={styles.innerText}>
                    Bug
                  </div>
                </div>
              </span>
            )
          }
          if(l.name === 'status/help-wanted' || l.name === 'status/easy-pick') {
            hasVisibleLabel = true
            tag = (
              <span className={styles.label + ' ' + styles.help}>
                <div className={styles.inner}>
                  <div className={styles.innerText}>
                  Help wanted
                  </div>
                </div>
              </span>
            )
          }
        })
      }
      let commentRender
      if (item.comments) {
        commentRender =(
          <a
            className={styles.commentLink}
            title={`${item.comments} comments on github`}
            target='_blank'
            href={githubURL}
          >
          <div className={styles.comment}>
              <div className={styles.commentIcon}>
                <CommentIcon />
              </div>
              <div className={styles.commentCount}>
                {item.comments}
              </div>
          </div>
          </a>
        )
      }

      var updatedTimestamp = new Date(item.updated_at).getTime();
      var createdTimeStamp = new Date(item.created_at).getTime();
      let debugInfo = (
        <span>
          {'updated'} - {getDayStart(updatedTimestamp)} <br/>
          {'created'} - {getDayStart(createdTimeStamp)} <br/>
          {'comments'} - {item.comments} <br/>
        </span>
      )
      debugInfo = null
      const visibleLabelClass = (hasVisibleLabel) ? styles.hasLabel : ''
      return(
        <li key={i} className={styles.card + ' ' + visibleLabelClass}>
          {tag}
          <div className={styles.title}>
            <a
              title={`View Issue #${item.number} on github`}
              target='_blank'
              href={githubURL}
            >
              {debugInfo}
              {item.title}
            </a>
          </div>
          <div className={styles.leftMeta + ' ' + hasMilestoneClass}>
          {assigneeRender}
          {commentRender}
          </div>
          {milestone}
        </li>
      )
    })
  }
  render () {
    const { title, items, id } = this.props
    let countRender
    if(items && items.length) {
      countRender = (
        <span className={styles.count}>
          ({items.length})
        </span>
      )
    }
    return (
      <div
        id={`serverless-status-column-${id}`}
        className={styles.column + ' serverless-status-column'}
      >
  			<div className={styles.header}>
  				<h2>
            <span>{title}</span>{countRender}
          </h2>
        </div>
  			<ul className={styles.cardList}>
  				{this.renderItems()}
  			</ul>
  		</div>
    )
  }
}

function getDayStart(unixTimeStamp) {
  var date = new Date(unixTimeStamp);
  return date.getFullYear() + '-' + pad((date.getMonth()+1)) + '-' + pad(date.getDate());
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

Column.propTypes = propTypes
