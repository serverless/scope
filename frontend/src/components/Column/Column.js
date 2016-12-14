import React, {Component, PropTypes} from 'react'

const propTypes = {
  children: PropTypes.any
}
export default class Column extends Component {
  constructor (props) {
    super(props)
  }
  renderItems() {
    const {count} = this.props
    let items = []
    for (var i = 0; i < count; i++) {
      items[i] = (
        <li className="drag-item">
          <span className="drag-item-text">
            API Gateway -> Kinesis Firehose - New Line Issue
          </span>
        </li>
      )
    }
    return items
  }
  render () {
    const { title } = this.props
    return (
      <li className="drag-column drag-column-in-progress">
  			<span className="drag-column-header">
  				<h2>{title}</h2>
          <svg class="drag-header-more" data-target="options2" fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </span>
  			<ul className="drag-inner-list" id="2">
  				{this.renderItems()}
  			</ul>
  		</li>
    )
  }
}

Column.propTypes = propTypes
