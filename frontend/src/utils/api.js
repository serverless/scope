import axios from 'axios'
import sortIssues from './sort'
import getConfig from './get-config'

const config = getConfig()

const api = {
  getCompleted: function (username) {
    if (!config.api && config.api.completed) {
      console.log('No completed endpoint found in config.api.completed')
      return Promise.resolve([])
    }
    return axios.get(config.api.completed).then((response) => {
      // console.log(response)
      const items = response.data.items
      return items
    }).catch((err) => {
      console.log(err)
      return []
    })
  },
  getOpenIssues: function (username) {
    if (!config.api && config.api.open) {
      console.log('No open endpoint found in config.api.open')
      return Promise.resolve([])
    }
    return axios.get(config.api.open).then((response) => {
      // console.log(response)
      const items = response.data.items
      return sortIssues(items, config.columns)
    }).catch((err) => {
      console.log(err)
      return []
    })
  }
}

export default api
