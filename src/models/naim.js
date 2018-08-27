import redmine from './redmine.js'

export default {

  projects: [],
  cunstomFields: [],
  issues: [],
  issueDetail: null,
  issueStatuses: null,
  issuePriorities: null,
  trackers: null,
  users: null,
  activities: null,
  documentCategories: null,
  online: true,

  initialize: async function (user) {
    console.log('initialize @ naim')
    redmine.configure(user)
    if (this.online) {
      try {
        await this.retrievePojects()
        await this.retrieveCustomFields()
        await this.retrieveIssues()
        await this.retrieveTrackers()
        await this.retrieveIssueStatuses()
        await this.retrieveIssuePriorities()
        await this.retrieveUsers()
        await this.retrieveTimeEntryActivities()
        await this.retrieveDocumentCategories()
      } catch (err) {
        throw err
      }
    } else {

    }
  },
  finalize: function () {
    this.clearProjects()
    this.clearIssues()
    this.clearCustomFileds()
    redmine.configure()
  },

  // ------------------
  // Users
  // ------------------
  retrieveUsers: async function () {
    try {
      await redmine.users(res => {
        console.log('==== Users @ naim ====')
        // console.log(res)
        this.users = res.data.users
      })
    } catch (err) {
      console.log('==== Users @ naim ====')
      console.log(err)
    }
  },
  getUsers: function () {
    return this.users
  },

  // ------------------
  // Projects data
  // ------------------
  retrievePojects: async function () {
    try {
      // Project List
      const prjs = []
      if (redmine.isConfigured()) {
        await redmine.projects({}, res => {
          console.log('==== Retrieve Projects @ naim ====')
          res.data.projects.forEach(element => {
            prjs.push(element)
            // console.log(element)
          })
        })
      }
      // ここで Project List を更新する。
      this.projects = prjs
      localStorage.removeItem('projects')
      localStorage.setItem('projects', this.projects)
    } catch (err) {
      alert(err)
      throw err
    }
  },
  createProject: async function (qstr) {
    try {
      await redmine.createProject(qstr, res => {
        // console.log('==== Create Project @ naim ====')
        // console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  updateProject: async function (prjId, qstr) {
    try {
      await redmine.updateProject(prjId, qstr, res => {
        // console.log('==== Update Project @ naim ====')
        // console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  deleteProject: async function (prjId) {
    try {
      await redmine.deleteProject(prjId, res => {
        // console.log('==== Delete Project @ naim ====')
        // console.log(res)
      })
    } catch (err) {
      throw err
    }
  },
  clearProjects: function () {
    this.projects = []
  },
  getProjects: function () {
    return this.projects
  },
  findProject: function (id) {
    let prj = null
    this.projects.forEach(element => {
      if (element.id === id) {
        prj = element
      }
    })
    return prj
  },

  // ------------------
  // CustomField data
  // ------------------
  retrieveCustomFields: async function () {
    try {
      const customfileds = []
      if (redmine.isConfigured()) {
        await redmine.customFields({}, res => {
          console.log('==== CustomFields @ naim ====')
          res.data.custom_fields.forEach(element => {
            customfileds.push(element)
            // console.log(element)
          })
        })
      }
      // ここで customfields List を更新する。
      this.cunstomFields = customfileds
      localStorage.removeItem('cunstomFields')
      localStorage.setItem('cunstomFields', this.cunstomFields)
    } catch (err) {
      throw err
    }
  },
  findCustomFieldId: function (fieldName) {
    let fieldId
    this.cunstomFields.forEach(element => {
      if (element.name === fieldName) {
        fieldId = element.id
      }
    })
    return fieldId
  },
  getCustomeFileds: function () {
    return this.cunstomFields
  },
  clearCustomFileds: function () {
    this.cunstomFields = []
  },
  // ------------------
  // Ticket Custom Filed
  // ------------------

  // ------------------
  // Issue data
  // ------------------
  retrieveIssues: async function () {
    try {
      // Issues List
      const iss = []
      if (redmine.isConfigured()) {
        await redmine.issues(res => {
          console.log('==== Issues @ naim ====')
          res.data.issues.forEach(element => {
            iss.push(element)
            // console.log(element)
          })
        })
      }
      // ここで Issue List を更新する。
      this.issues = iss
      localStorage.removeItem('issues')
      localStorage.setItem('issues', this.issues)
    } catch (err) {
      alert(err)
      throw err
    }
  },
  retrieveIssueDetail: async function (issId) {
    try {
      await redmine.getIssue(issId, res => {
        // console.log('==== Issue Detail @ naim ====')
        // console.log(res)
        this.issueDetail = res.data.issue
      })
    } catch (err) {
      console.log('==== Issue Detail @ naim ====')
      console.log(err)
    }
  },
  createIssue: async function (qstr) {
    try {
      let ret = await redmine.createIssue(qstr, res => {
        console.log('==== Create Issue @ naim ====')
        console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },
  updateIssue: async function (issId, qstr) {
    try {
      // console.log('updateIssue @ naim : ' + issId)
      // console.log(qstr)
      await redmine.updateIssue(issId, qstr, res => {
        console.log('==== Update Issue @ naim ====')
        console.log(res)
      })
    } catch (err) {
      throw err
    }
  },

  retrieveIssueStatuses: async function () {
    try {
      await redmine.getIssueStatuses(res => {
        console.log('==== Issue Statuses @ naim ====')
        // console.log(res)
        this.issueStatuses = res.data.issue_statuses
      })
    } catch (err) {
      console.log('==== Issue Statuses @ naim ====')
      console.log(err)
    }
  },
  getIssues: function () {
    return this.issues
  },
  getIssueStatuses: function () {
    return this.issueStatuses
  },
  getIssueDetail: function () {
    return this.issueDetail
  },
  clearIssues: function () {
    this.issues = []
  },

  uploadFiles: async function (data) {
    console.log(data)
    try {
      let ret = await redmine.attachingFiles(data, res => {
        // console.log('==== uploadFiles @ naim ====')
        // console.log(res)
      })
      return ret
    } catch (err) {
      throw err
    }
  },

  // ------------------
  // Trackers
  // ------------------
  retrieveTrackers: async function () {
    try {
      await redmine.getTrackers(res => {
        console.log('==== trackers @ naim ====')
        // console.log(res)
        this.trackers = res.data.trackers
        localStorage.removeItem('trackers')
        localStorage.setItem('trackers', this.trackers)
      })
    } catch (err) {
      console.log('==== trackers @ naim ====')
      console.log(err)
    }
  },
  getTrackers: function () {
    return this.trackers
  },

  // ------------------
  // Enumeration
  // ------------------
  retrieveIssuePriorities: async function () {
    try {
      await redmine.getIssuePriorities(res => {
        console.log('==== IssuePriorities @ naim ====')
        // console.log(res)
        this.issuePriorities = res.data.issue_priorities
        localStorage.removeItem('issuePriorities')
        localStorage.setItem('issuePriorities', this.issuePriorities)
      })
    } catch (err) {
      console.log('==== IssuePriorities @ naim ====')
      console.log(err)
    }
  },
  getIssuePriorities: function () {
    return this.issuePriorities
  },
  retrieveTimeEntryActivities: async function () {
    try {
      await redmine.getTimeEntryActivities(res => {
        console.log('==== TimeEntryActivities @ naim ====')
        // console.log(res)
        this.activities = res.data.time_entry_activities
        localStorage.removeItem('activities')
        localStorage.setItem('activities', this.activities)
      })
    } catch (err) {
      console.log('==== TimeEntryActivities @ naim ====')
      console.log(err)
    }
  },
  getTimeEntryActivities: function () {
    return this.activities
  },
  retrieveDocumentCategories: async function () {
    try {
      await redmine.getDocumentCategories(res => {
        console.log('==== DocumentCategories @ naim ====')
        // console.log(res)
        this.documentCategories = res.data.document_categories
        localStorage.removeItem('documentCategories')
        localStorage.setItem('documentCategories', this.documentCategories)
      })
    } catch (err) {
      console.log('==== DocumentCategories @ naim ====')
      console.log(err)
    }
  },
  getDocumentCategories: function () {
    return this.documentCategories
  }
}
