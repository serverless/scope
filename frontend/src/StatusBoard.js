import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import Column from './components/Column/Column'
import api from './utils/api'
import getConfig from './utils/get-config'
import GearIcon from './components/Gear/Gear'
import styles from './StatusBoard.css'

const initialConfig = getConfig()

export default class StatusBoard extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      config: initialConfig,
      loading: true,
      showOptions: false
    }
    this.columnNodes = null
  }
  componentDidMount() {
    // Call API for issue data
    api.getCompleted().then((items) => {
      this.setState({
        completedItems: items,
      })
    })
    api.getOpenIssues().then((sortedItems) => {
      // console.log('sortedItems', sortedItems)
      this.setState({
        loading: false,
        ...sortedItems
      }, () => {
        // get columns Nodes for mobile toggling
        this.columnNodes = this.refs.columnList.querySelectorAll('.serverless-status-column')
      })
    })
    // Set debounced resize listener
    this.resizeFunction = debounce(this.handleDesktopResize, 100)
    window.addEventListener('resize', this.resizeFunction)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction)
  }
  changeView = (e) => {
    const columnNodes = this.refs.columnList.querySelectorAll('.serverless-status-column')
    // mobile safari choking on forEach ¯\_(ツ)_/¯
    for (var i = 0; i < columnNodes.length; i++) {
      const column = columnNodes[i]
      let id = column.id.replace('serverless-status-column-', '')
      let toggle = (e.target.dataset.column === id) ? 'block' : 'none'
      column.style.display = toggle
    }
  }
  handleDesktopResize = (e) => {
    if (window.outerWidth > 670) {
      this.columnNodes.forEach((column) => {
        column.style.display = 'block'
      })
    }
  }
  renderColumns() {
    const { completedItems, config } = this.state
    const hasCompletedItems = (completedItems) ? completedItems.length : false

    let columns = config.columns.map((column, i) => {
      return (
        <Column
          stickyMilestones={config.stickyMilestones}
          sortOrder={config.sortOrder}
          sortBy={config.sortBy}
          key={i}
          id={i}
          title={column.title}
          items={this.state[column.title]}
        />
      )
    })
    // show recently completed column only if turned on and has items
    if (config.recentlyCompleted && config.recentlyCompleted.show && hasCompletedItems) {
      columns.push(
        <Column
          stickyMilestones={config.stickyMilestones}
          sortOrder={config.sortOrder}
          sortBy={config.sortBy}
          key={config.columns.length}
          id={config.columns.length}
          title='recently completed'
          items={completedItems}
        />
      )
    }
    return columns
  }
  renderMobileToggles () {
    const { config, completedItems } = this.state
    const hasCompletedItems = (completedItems) ? completedItems.length : false
    let mobileToggles = config.columns.map((column, i) => {
      return (
        <span
          key={i}
          data-column={i}
          onClick={this.changeView}
          className={styles.item}
        >
         {column.title}
        </span>
      )
    })
    if (config.recentlyCompleted && config.recentlyCompleted.show && hasCompletedItems) {
      mobileToggles.push(
        <span
          key={config.columns.length}
          data-column={config.columns.length}
          onClick={this.changeView}
          className={styles.item}
        >
          Completed
        </span>
      )
    }
    return mobileToggles
  }
  changeSetting = (e) => {
    let updatedOptions = {}
    let setting = e.target.parentNode.dataset.setting
    let value = e.target.dataset.value
    if (value === 'false') {
      value = false
    }
    if (value === 'milestone') {
      // set sort to milestone at top
      setting = 'stickyMilestones'
      value = true
    }

    updatedOptions[setting] = value
    this.setState({
      config: { ...this.state.config, ...updatedOptions }
    })
  }
  toggleSetting = () => {
    this.setState({
      showOptions: !this.state.showOptions
    })
  }
  render() {
    const { showOptions, loading } = this.state
    const showMenu = (showOptions) ? 'block' : 'none'
    if (loading) {
      return (
        <div className={styles.loading}>
            <div className={styles.rotatingPlane}></div>
        </div>
      )
    }
    return (
      <div className={styles.container}>
        <div className={styles.svg}>
          <span onClick={this.toggleSetting}><GearIcon  /></span>
          <div className={styles.settings} style={{display: showMenu}}>

            <div className={styles.section}>
              <div className={styles.header}>Sort by:</div>
              <div className={styles.options} data-setting='sortBy'>
                <div className={styles.option} onClick={this.changeSetting} data-value='created_at'>
                  Creation Date
                </div>
                <div className={styles.option} onClick={this.changeSetting} data-value='updated_at'>
                  Last updated date
                </div>
                <div className={styles.option} onClick={this.changeSetting} data-value='comments'>
                  Comment count
                </div>
                {/*<div className={styles.option} onClick={this.changeSetting} data-value='milestone'>
                  Milestone
                </div>*/}
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.header}>Sort order:</div>
              <div className={styles.options} data-setting='sortOrder'>
                <div
                  className={styles.option}
                  onClick={this.changeSetting}
                  data-value='desc'>
                  Descending ▼
                </div>
                <div
                  className={styles.option}
                  onClick={this.changeSetting}
                  data-value='asc'>
                  Ascending ▲
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className={styles.header}>Milestones:</div>
              <div className={styles.options} data-setting='stickyMilestones'>
                <div className={styles.option} onClick={this.changeSetting} data-value='true'>
                  Milestones on top
                </div>
                <div className={styles.option} onClick={this.changeSetting} data-value='false'>
                  Mixed
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref='columnList' className={styles.list}>
          {this.renderColumns()}
        </div>
        <div className={styles.mobileSwitcher}>
          {this.renderMobileToggles()}
        </div>
      </div>
    );
  }
}
