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
                <img role="presentation" src={githubUserImage(person.id, 25)}/>
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
        milestone = (
          <span className={styles.milestone}>
            {item.milestone.title}
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
    const { title } = this.props
    return (
      <div className={styles.column}>
  			<div className={styles.header}>
  				<h2>{title}</h2>
        </div>
  			<ul className={styles.cardList}>
  				{this.renderItems()}
  			</ul>
  		</div>
    )
  }
}

Column.propTypes = propTypes
