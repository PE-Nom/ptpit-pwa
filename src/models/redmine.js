import axios from 'axios'
import URLjoin from 'url-join'
import config from '../config.js'

export default {
  rmc: null,
  configured: false,
  user: {
    username: config.Username,
    password: config.Password
  },
  configure () {
    if (!this.isConfigured()) {
      this.rmc = axios.create({
        baseURL: URLjoin(config.BaseURL, '/redmine'),
        auth: {
          username: this.user.username,
          password: this.user.password
        },
        json: true
      })
      this.configured = true
    }
  },
  isConfigured () {
    return this.configured
  },

  // ============
  // Users
  // ============
  async users (callback) {
    await this.rmc.get('/users.json')
      .then(res => {
        console.log(res)
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  // ============
  // Custom Field
  // ============
  async customFields (params, callback) {
    await this.rmc.get('/custom_fields.json', params)
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },

  // ============
  // Project
  // ============
  async projects (params, callback) {
    await this.rmc.get('/projects.json', params)
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async membershipOfProject (id, callback) {
    await this.rmc.get('/projects/' + id + '/memberships.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async createProject (data, callback) {
    console.log('createProject @ redmine.js')
    await this.rmc.post('/projects.json', data, {headers: {'Content-Type': 'application/json'}})
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw (err)
      })
  },
  async updateProject (prjId, data, callback) {
    console.log('updateProject @ redmine.js')
    await this.rmc.put('/projects/' + prjId + '.json', data, {headers: {'Content-Type': 'application/json'}})
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw (err)
      })
  },
  async deleteProject (prjId, callback) {
    console.log('deleteProject @ redmain.js')
    await this.rmc.delete('/projects/' + prjId + '.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw (err)
      })
  },

  // ============
  // Issue
  // ============
  async issues (callback) {
    await this.rmc.get('/issues.json?limit=100')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async createIssue (data, callback) {
    console.log('createIssue @ redmine.js')
    let ret = null
    await this.rmc.post('/issues.json', data, {headers: {'Content-Type': 'application/json'}})
      .then(res => {
        callback(res)
        ret = res
      })
      .catch(err => {
        throw (err)
      })
    return ret
  },
  async updateIssue (issId, data, callback) {
    console.log('updateIssue @ redmine.js')
    await this.rmc.put('/issues/' + issId + '.json', data, {headers: {'Content-Type': 'application/json'}})
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw (err)
      })
  },
  async getIssue (issId, callback) {
    console.log('getIssue @ redmine.js')
    await this.rmc.get('/issues/' + issId + '.json?include=attachments,journals')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw (err)
      })
  },
  async getIssueStatuses (callback) {
    // console.log('getIssueStatuses @ redmine.js')
    await this.rmc.get('/issue_statuses.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async attachingFiles (data, callback) {
    console.log('attachingFiles @ redmine.js')
    console.log(data)
    let ret = null
    await this.rmc.post('/uploads.json', data, {headers: {'Content-Type': 'application/octet-stream'}})
      .then(res => {
        callback(res)
        ret = res
      })
      .catch(err => {
        throw (err)
      })
    return ret
  },

  // ============
  // Trackers
  // ============
  async getTrackers (callback) {
    // console.log('getTrackers @ redmine.js')
    await this.rmc.get('/trackers.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },

  // ============
  // Enumeration
  // ============
  async getIssuePriorities (callback) {
    // console.log('getIssuePriority @ reamine.js')
    await this.rmc.get('/enumerations/issue_priorities.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async getTimeEntryActivities (callback) {
    // console.log('getTimeEntryActivities')
    await this.rmc.get('/enumerations/time_entry_activities.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  },
  async getDocumentCategories (callback) {
    // console.log('getDocumentCategories')
    await this.rmc.get('/enumerations/document_categories.json')
      .then(res => {
        callback(res)
      })
      .catch(err => {
        throw err
      })
  }

}
