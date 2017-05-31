import React from 'react'
import ReactDOM from 'react-dom'
import StatusBoard from './StatusBoard'
import getConfig from './utils/get-config'

const config = getConfig()

const startReactApp = () => {
  ReactDOM.render(<StatusBoard />, document.getElementById(config.mountNodeID))
}

/* Reload function for ajax drvien sites */
if (typeof window.loadStatusBoard === 'undefined') {
  window.loadStatusBoard = function() {
    function initializeApp() {
      const mountNode = document.getElementById(config.mountNodeID)
      const scriptsReady = typeof window.React !== 'undefined' && typeof window.ReactDOM !== 'undefined'
      // wait for mount node to load
      if (!mountNode || !scriptsReady) {
        setTimeout(initializeApp, 50)
        return
      }
      // react & mount node ready, start react app
      startReactApp()
    }
    // start recursive bootstrap call
    initializeApp()
  }
}

// load react app
window.loadStatusBoard()
