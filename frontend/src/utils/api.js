import axios from 'axios'
import sortIssues from './sort'

const BASE = 'https://kouf9xf85f.execute-api.us-west-2.amazonaws.com'
const COMPLETED_ENDPOINT = `${BASE}/dev/completed`
const OPEN_ENDPOINT = `${BASE}/dev/issues`

const api = {
  getCompleted: function (username) {
    return axios.get(COMPLETED_ENDPOINT).then((response) => {
      const body = JSON.parse(response.data.body)
      return body.items
    }).catch((err) => {
      console.log(err)
      return []
    })
  },
  getOpenIssues: function (username) {
    return axios.get(OPEN_ENDPOINT).then((response) => {
      const body = JSON.parse(response.data.body)
      return sortIssues(body.items)
    }).catch((err) => {
      console.log(err)
      return []
    })
  }
}

export default api