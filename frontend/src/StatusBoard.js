import React, { Component } from 'react'
import debounce from 'lodash.debounce'
import Column from './components/Column/Column'
import api from './utils/api'
import initialConfig from './config'
import GearIcon from './components/Gear/Gear'
import styles from './StatusBoard.css'

export default class StatusBoard extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      config: initialConfig,
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
    });
    api.getOpenIssues().then((sortedItems) => {
      this.setState(sortedItems)
    })
    // get columns Nodes for mobile toggling
    this.columnNodes = this.refs.columnList.querySelectorAll('.serverless-status-column')
    // Set debounced resize listener
    this.resizeFunction = debounce(this.handleDesktopResize, 100)
    window.addEventListener('resize', this.resizeFunction)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction)
  }
  changeView = (e) => {
    this.columnNodes.forEach((column) => {
      let id = column.id.replace('serverless-status-column-', '')
      let toggle = (e.target.dataset.column === id) ? 'block' : 'none'
      column.style.display = toggle
    })
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
    let columns = config.columns.map((column, i) => {
      return (
        <Column
          sortMilestonesFirst={config.sortMilestonesFirst}
          sortOrder={config.sortOrder}
          sortBy={config.sortBy}
          key={i}
          id={i}
          title={column.title}
          items={this.state[column.title]}
        />
      )
    })
    if (config.recentlyCompleted && config.recentlyCompleted.show) {
      columns.push(
        <Column
          sortMilestonesFirst={config.sortMilestonesFirst}
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
    const { config } = this.state
    let mobileToggles = config.columns.map((column, i) => {
      return (
        <span
          key={i}
          data-column={i}
          onClick={this.changeView}
          className={styles.item}
        >
         {column.mobileToggleTitle}
        </span>
      )
    })
    if (config.recentlyCompleted && config.recentlyCompleted.show) {
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
    const setting = e.target.parentNode.dataset.setting
    let value = e.target.dataset.value
    if (value === 'false') {
      value = false
    }
    // console.log('setting', setting)
    // console.log('settingValue', value)
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
    const { showOptions } = this.state
    const showMenu = (showOptions) ? 'block' : 'none'
    const bgColor = initialConfig.theme.backgroundColor
    return (
      <div className={styles.container} style={{backgroundColor: bgColor}}>
        <div className={styles.svg}>
          <span onClick={this.toggleSetting}><GearIcon  /></span>
          <div className={styles.options} style={{display: showMenu}}>
            <div className={styles.section} data-setting='sortMilestonesFirst'>
              <div className={styles.header}>Milestones:</div>
              <div className={styles.option} onClick={this.changeSetting} data-value='true'>
                On Top
              </div>
              <div className={styles.option} onClick={this.changeSetting} data-value='false'>
                Mixed
              </div>
            </div>
            <div className={styles.section} data-setting='sortBy'>
              <div className={styles.header}>Sort by:</div>
              <div className={styles.option} onClick={this.changeSetting} data-value='created_at'>
                Creation Date
              </div>
              <div className={styles.option} onClick={this.changeSetting} data-value='updated_at'>
                Last updated date
              </div>
              <div className={styles.option} onClick={this.changeSetting} data-value='comments'>
                Comment count
              </div>
            </div>
            <div className={styles.section} data-setting='sortOrder'>
              <div className={styles.header}>Sort order:</div>
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
