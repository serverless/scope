import React from 'react'
import ReactDOM from 'react-dom'
import StatusBoard from './StatusBoard'
import getConfig from './utils/get-config'

const config = getConfig()

const initStatusBoard = () => {
  ReactDOM.render(<StatusBoard />, document.getElementById(config.mountNodeID))
}

// load react app
initStatusBoard()

/* Reload function for ajax drvien sites */
if (typeof window.statusBoardReload === 'undefined') {
  window.statusBoardReload = function() {
    console.log('reload');
    function resetApp() {
      const mountNode = config.mountNodeID
      // wait for mount node to load
      if (!document.getElementById(mountNode)) {
        setTimeout(resetApp, 50);
        return;
      }
      // reload react app with window.statusBoardReload() call
      initStatusBoard();
    }
    resetApp();
  }
}
