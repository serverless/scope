import React, {Component, PropTypes} from 'react'
import CommentIcon from '../Comment/Comment'
import MilestoneIcon from '../Milestone/Milestone'
import LabelIcon from '../Label/Label'
import LinkIcon from '../Link/Link'
import getConfig from '../../utils/get-config'
import timeAgo from 'time-ago'
import { githubIssueURL, githubUserImage } from '../../utils/github-urls'
import styles from './Column.css'

const config = getConfig()
const ta = timeAgo()
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
    let ribbonLabels = config.ribbons
    // console.log('id', id)



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

      // has special label requirements?
      let tag
      if (ribbonLabels && item.labels && item.labels.length) {
        // console.log('specialTags', specialTags)
        const normalizedLabelsFromItem = item.labels.map((labelItem) => {
          return labelItem.name
        })
        Object.keys(ribbonLabels).forEach((n, j) => {
          // console.log(n)
          if (normalizedLabelsFromItem.includes(n)) {
            const bgColor = ribbonLabels[n].backgroundColor
            const textColor = ribbonLabels[n].textColor
            const ribbonText = ribbonLabels[n].text
            if (textColor) {
              // console.log('-----------------------')
              // console.log('Match!', ribbonText)
              // console.log(item)
              hasVisibleLabel = true
              tag = (
                <span key={j} className={styles.label + ' ' + styles.help} style={{background: bgColor}}>
                  <div className={styles.inner}>
                    <div className={styles.innerText} style={{color: textColor}}>
                      {ribbonText}
                    </div>
                  </div>
                </span>
              )
              // console.log('-----------------------')
            }
          }
        })
      }

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
      let testTags = []
      let filler = []

      if (item.labels && item.labels.length) {
        // console.log(item.labels)
        item.labels.forEach((l, n) => {
          const githubLabelLink = `https://github.com/serverless/serverless/labels/${l.name}`
          testTags.push(
            <a className={styles.labelLink} href={githubLabelLink} target='_blank'>
              <span key={n} className={styles.tag} style={{background: `#${l.color}`}}>
                <span className={styles.tooltip}>{l.name}</span>
              </span>
            </a>
          )
          filler.push(
            <div
              style={{background: `#${l.color}`,
              height: `${100 / item.labels.length}%`,
              width: `100%` }}>
            </div>
          )
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

      let debugInfo
      if (config.debug) {
        debugInfo = (
          <span>
            {'updated'} - {getDayStart(updatedTimestamp)} <br/>
            {'created'} - {getDayStart(createdTimeStamp)} <br/>
            {'comments'} - {item.comments} <br/>
          </span>
        )
      }
      // debugInfo = null
      const visibleLabelClass = (hasVisibleLabel) ? styles.hasLabel : ''
      const time = ta.ago(updatedTimestamp)
      let showTags
      if (testTags.length) {
        showTags = <span className={styles.tagContainer} data-tooltip="Hello World!"><LabelIcon />{testTags}</span>
      }
      return(
        <li key={i} className={styles.card + ' ' + visibleLabelClass}>
          <div className={styles.timeAgo}>{time}</div>
          {tag}

          <div className={styles.title}>
            <a
              target='_blank'
              href={githubURL}
            >
              {debugInfo}

              {item.title}<span className={styles.linkIcon}><LinkIcon/></span>
            </a>
          </div>
          <div className={styles.leftMeta + ' ' + hasMilestoneClass}>
          {assigneeRender}
          {commentRender}
          {showTags}
          {milestone}
          </div>

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
