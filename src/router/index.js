import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import IssuesList from '@/components/IssuesList'
import EditIssue from '@/components/EditIssue'
import PendingRequestList from '@/components/PendingRequestList'
import EditPendingRequest from '@/components/EditPendingRequest'
import AttachmentViewer from '@/components/AttachmentViewer'
import PendingRequestAttachmentViewer from '@/components/PendingRequestAttachmentViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tickets',
      name: 'TicketList',
      component: IssuesList
    },
    {
      path: '/editissue',
      name: 'EditIssue',
      component: EditIssue
    },
    {
      path: '/attachmentviewer',
      name: 'AttachmentViewer',
      component: AttachmentViewer
    },
    {
      path: '/pendingrequests',
      name: 'PendingRequestsList',
      component: PendingRequestList
    },
    {
      path: '/editpendingrequest',
      name: 'EditPendingRequest',
      component: EditPendingRequest
    },
    {
      path: '/pendingrequestattachmentviewer',
      name: 'PendingRequestAttachmentViewer',
      component: PendingRequestAttachmentViewer
    }
  ]
})
