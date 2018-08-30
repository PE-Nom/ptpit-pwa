import store from '../store.js'
import pendingRequestManager from './pendingRequestManager.js'
import redmine from './redmine.js'
import editstate from './editState.js'
import util from './util.js'

export default {

  projects: [],
  customFields: [],
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
    if (store.getters.connectStat) {
      try {
        // pendingRequestManager.clear()
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
      this.projects = JSON.parse(localStorage.getItem('projects'))
      this.issues = JSON.parse(localStorage.getItem('issues'))
      this.trackers = JSON.parse(localStorage.getItem('trackers'))
      this.issueStatuses = JSON.parse(localStorage.getItem('issueStatuses'))
      this.issuePriorities = JSON.parse(localStorage.getItem('issuePriorities'))
      this.users = JSON.parse(localStorage.getItem('users'))
      this.activities = JSON.parse(localStorage.getItem('activities'))
      this.documentCategories = JSON.parse(localStorage.getItem('documentCategories'))
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
        this.users = util.convertUsersObjs(res.data.users)
        localStorage.removeItem('users')
        localStorage.setItem('users', JSON.stringify(this.users))
        console.log(this.users)
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
      this.projects = util.convertOptionObjs(prjs, 'name')
      localStorage.removeItem('projects')
      localStorage.setItem('projects', JSON.stringify(this.projects))
      console.log(this.projects)
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
      this.customFields = customfileds
      console.log(this.customFields)
      localStorage.removeItem('customFields')
      localStorage.setItem('customFields', JSON.stringify(this.customFields))
    } catch (err) {
      throw err
    }
  },
  findCustomFieldId: function (fieldName) {
    let fieldId
    this.customFields.forEach(element => {
      if (element.name === fieldName) {
        fieldId = element.id
      }
    })
    return fieldId
  },
  getCustomeFileds: function (fieldName) {
    let customField = null
    this.customFields.forEach(element => {
      if (element.name === fieldName) {
        customField = util.convertOptions(element.possible_values)
      }
    })
    return customField
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
      if (store.getters.connectStat) {
        // Issues List
        const iss = []
        this.issues = []
        if (redmine.isConfigured()) {
          await redmine.issues(res => {
            console.log('==== Issues @ naim ====')
            res.data.issues.forEach(el => {
              iss.push(el)
              // console.log(element)
              let assignedName = el.assigned_to ? el.assigned_to.name : ''
              let dueRatio = el.done_ratio ? el.done_ratio : '0'
              let dueDate = el.due_date ? el.due_date : '未定義'
              let rec = '{' +
              ' "' + util.columns[0] + '" : "#' + el.id + '"' +
              ',"' + util.columns[1] + '" : "' + el.tracker.name + '"' +
              ',"' + util.columns[2] + '" : "' + el.project.name + '"' +
              ',"' + util.columns[3] + '" : "' + el.subject + '"' +
              ',"' + util.columns[4] + '" : "' + el.priority.name + '"' +
              ',"' + util.columns[5] + '" : "' + el.status.name + '"' +
              ',"' + util.columns[6] + '" : "' + dueRatio + ' %"' +
              ',"' + util.columns[7] + '" : "' + el.author.name + '"' +
              ',"' + util.columns[8] + '" : "' + assignedName + '"' +
              ',"' + util.columns[9] + '" : "' + el.start_date + '"' +
              ',"' + util.columns[10] + '" : "' + dueDate + '"' +
              ',"' + util.columns[11] + '" : "' + el.updated_on + '"' +
            '}'
              let obj = JSON.parse(rec)
              this.issues.push(obj)
            })
          })
        }
        localStorage.removeItem('issues')
        localStorage.setItem('issues', JSON.stringify(this.issues))
        console.log(this.issues)
      } else {
        this.issues = JSON.parse(localStorage.getItem('issues'))
      }
    } catch (err) {
      alert(err)
      throw err
    }
  },
  getIssues: function () {
    return this.issues
  },

  // redmineに問い合わせ
  retrieveIssueDetail: async function (issId) {
    try {
      await redmine.getIssue(issId, res => {
        // console.log('==== Issue Detail @ naim ====')
        // console.log(res)
        let storageKey = 'issue-' + issId
        console.log('storageKey = ' + storageKey)
        this.issueDetail = res.data.issue
        localStorage.removeItem(storageKey)
        localStorage.setItem(storageKey, JSON.stringify(this.issueDetail))
        console.log(this.issueDetail)
        // return issueDetail
      })
    } catch (err) {
      console.log('==== Issue Detail @ naim ====')
      console.log(err)
    }
  },
  // localStorageを検索
  searchIssueDetail: function (issId) {
    let storageKey = 'issue-' + issId
    if (storageKey in localStorage) {
      this.issueDetail = JSON.parse(localStorage.getItem(storageKey))
    } else {
      this.issueDetail = null
    }
  },
  getIssueDetail: async function (issId) {
    console.log('store.getters.connectStat = ' + store.getters.connectStat)
    if (store.getters.connectStat) {
      await this.retrieveIssueDetail(issId)
    } else {
      this.searchIssueDetail(issId)
    }
    return this.issueDetail
  },

  createIssue: async function (qobj) {
    try {
      if (store.getters.connectStat) {
        let ret = await redmine.createIssue(JSON.stringify(qobj), res => {
          console.log('==== Create Issue @ naim ====')
          console.log(res)
        })
        return ret
      } else {
        // オフラインの実験
        let pendingRequest = {
          request: 'create',
          id: '-1',
          query: qobj
        }
        pendingRequestManager.push(pendingRequest)
        let ret = {
          data: {
            issue: {
              id: -1
            }
          }
        }
        return ret
      }
    } catch (err) {
      throw err
    }
  },
  updateIssue: async function (issId, qobj) {
    try {
      if (store.getters.connectStat) {
        // console.log('updateIssue @ naim : ' + issId)
        // console.log(qstr)
        await redmine.updateIssue(issId, JSON.stringify(qobj), res => {
          console.log('==== Update Issue @ naim ====')
          console.log(res)
        })
      } else {
        let pendingRequest = {
          request: 'update',
          id: issId,
          query: qobj
        }
        pendingRequestManager.push(pendingRequest)
        // let req = pendingRequestManager.shift()
        // console.log('==== pendingRequestManager.pop() ====')
        // console.log(req)
      }
    } catch (err) {
      throw err
    }
  },

  retrieveIssueStatuses: async function () {
    try {
      await redmine.getIssueStatuses(res => {
        console.log('==== Issue Statuses @ naim ====')
        this.issueStatuses = util.convertOptionObjs(res.data.issue_statuses, 'name')
        localStorage.removeItem('issueStatuses')
        localStorage.setItem('issueStatuses', JSON.stringify(this.issueStatuses))
        console.log(this.issueStatuses)
      })
    } catch (err) {
      console.log('==== Issue Statuses @ naim ====')
      console.log(err)
    }
  },
  getIssueStatuses: function () {
    return this.issueStatuses
  },

  retrieveIssuePriorities: async function () {
    try {
      await redmine.getIssuePriorities(res => {
        console.log('==== Issue Priorities @ naim ====')
        this.issuePriorities = util.convertOptionObjs(res.data.issue_priorities, 'name')
        localStorage.removeItem('issuePriorities')
        localStorage.setItem('issuePriorities', JSON.stringify(this.issuePriorities))
        console.log(this.issuePriorities)
      })
    } catch (err) {
      console.log('==== IssuePriorities @ naim ====')
      console.log(err)
    }
  },
  getIssuePriorities: function () {
    return this.issuePriorities
  },

  clearIssues: function () {
    this.issues = []
  },

  uploadFile: async function (file, mediaData, imageDescription) {
    console.log('uploadFile @ naim')
    let ret = null
    try {
      if (store.getters.connectStat) {
        console.log(file)
        ret = await redmine.attachingFiles(file, res => {
          // console.log('==== uploadFiles @ naim ====')
          // console.log(res)
        })
        return ret
      } else {
        let pendingRequest = {
          request: 'file attach',
          id: editstate.currentIssueId,
          description: imageDescription,
          mediaData: mediaData,
          name: file.name,
          size: file.size,
          file_property_bag: {
            type: file.type,
            lastModified: file.lastModified
          }
        }
        pendingRequestManager.push(pendingRequest)
        return ret
      }
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
        this.trackers = util.convertOptionObjs(res.data.trackers, 'name')
        localStorage.removeItem('trackers')
        localStorage.setItem('trackers', JSON.stringify(this.trackers))
        console.log(this.trackers)
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
  retrieveTimeEntryActivities: async function () {
    try {
      await redmine.getTimeEntryActivities(res => {
        console.log('==== TimeEntryActivities @ naim ====')
        this.activities = util.convertOptionObjs(res.data.time_entry_activities, 'name')
        localStorage.removeItem('activities')
        localStorage.setItem('activities', JSON.stringify(this.activities))
        console.log(this.activities)
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
        this.documentCategories = util.convertOptionObjs(res.data.document_categories, 'name')
        localStorage.removeItem('documentCategories')
        localStorage.setItem('documentCategories', JSON.stringify(this.documentCategories))
        console.log(this.documentCategories)
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
