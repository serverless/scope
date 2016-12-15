import React, { Component } from 'react';
import Column from './components/Column/Column'
import styles from './Roadmap.css'


class Roadmap extends Component {
  render() {
    return (
      <div className={styles.roadmap}>
        <div className="drag-list">
          <Column title='discussing' count={20} />
          <Column title='waiting' count={15} />
          <Column title='coding' count={30} />
          <Column title='reviewing' count={15} />
          <Column title='recently completed' count={55} />
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
