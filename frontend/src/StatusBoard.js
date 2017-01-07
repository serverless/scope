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
      config: initialConfig
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
  changeIt = () => {
    const newConfig = { ...initialConfig, ...{ recentlyCompleted: false}}
    this.setState({
      config: newConfig
    })
  }
  toggleSetting = () => {
    alert('settings coming soon')
  }
  render() {
    // <button onClick={this.changeIt}>Change config</button>
    const bgColor = initialConfig.theme.backgroundColor
    return (
      <div className={styles.container} style={{backgroundColor: bgColor}}>
        <div className={styles.svg} onClick={this.toggleSetting}>
          <GearIcon />
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
