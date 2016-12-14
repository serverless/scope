import React, { Component } from 'react';
import Column from './components/Column/Column'
import styles from './Roadmap.css'


class Roadmap extends Component {
  render() {
    return (
      <div className={styles.roadmap}>
        <div className="drag-list">
          <Column title='discussing' count={20} />
          <Column title='waiting'  count={5} />
          <Column title='coding' count={30} />
          <Column title='reviewing' count={15} />
          <Column title='recently completed' count={55} />
        </div>
      </div>
    );
  }
}

export default Roadmap;
