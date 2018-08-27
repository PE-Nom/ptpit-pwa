import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import IssuesList from '@/components/IssuesList'
import EditIssue from '@/components/EditIssue'

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
    }
  ]
})
