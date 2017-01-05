import React, {Component, PropTypes} from 'react'
import styles from './Column.css'
import { githubIssueURL, githubUserImage } from '../../utils/github-urls'

const propTypes = {
  children: PropTypes.any
}
export default class Column extends Component {
  renderItems() {
    const { items } = this.props
    if (!items) {
      return null
    }
    /*
    if the function returns less than zero, sort a before b
    if the function returns greater than zero, sort b before a
    if the function returns zero, leave a and b unchanged with respect to each other
    */
    // sort here
    const defaultOrder = items.sort((a, b) => {
      // put table of contents (TOC) at end of tranforms
      if(a.milestone && b.milestone) {
        let A = parseFloat(a.milestone.title)
        let B = parseFloat(b.milestone.title)
        if(isNaN(A)) {
          A = 1000 // no milestone push to end
        }
        if(isNaN(B)) {
          B = 1000 // no milestone push to end
        }
        // console.log('a.milestone.title', A)
        // console.log('b.milestone.title', B)
        // console.log('-------------')
        if (A < B) return -1
        if (A > B) return 1
      }
      return 0
    })
    // console.log('new order', defaultOrder)

    return items.map((item, i) => {
      let hasVisibleLabel = false
      // console.log('title', title)
      // console.log('item', item)
      let assigneeRender
      if (item.assignees && item.assignees.length) {
        // console.log('assignee', item.assignees)
        assigneeRender = item.assignees.map((person, j) => {
          // console.log(person)
          return (
            <div key={j} className={styles.assignee}>
              <div className={styles.image}>
                <img role="presentation" src={githubUserImage(person.id, 20)}/>
              </div>
              <div className={styles.name}>
                {person.login}
              </div>
            </div>
          )
        })
      }
      let milestone = item.milestone.title
      if (item.milestone && item.milestone.title) {
        const mileNumber =item.milestone.number
        milestone = (
          <span className={styles.milestone}>
            <a
              title={`View Milestone ${item.milestone.title} on github`}
              target='_blank'
              href={`https://github.com/serverless/serverless/milestone/${mileNumber}`}
            >
              {item.milestone.title}
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

      const visibleLabelClass = (hasVisibleLabel) ? styles.hasLabel : ''
      const githubURL = githubIssueURL(item.number, 'serverless/serverless')
      return(
        <li key={i} className={styles.card + ' ' + visibleLabelClass}>
          {tag}
          <div className={styles.title}>
            <a
              title={`View Issue #${item.number} on github`}
              target='_blank'
              href={githubURL}
            >
              {item.title}
            </a>
          </div>
          {assigneeRender}
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
        id={`status-column-${id}`}
        className={styles.column + ' status-board-column'}
      >
  			<div className={styles.header}>
  				<h2><span>{title}</span>{countRender}</h2>
        </div>
  			<ul className={styles.cardList}>
  				{this.renderItems()}
  			</ul>
  		</div>
    )
  }
}

Column.propTypes = propTypes
