import Vue from 'vue'
import Router from 'vue-router'
import IssuesList from '@/components/IssuesList'
import Home from '@/components/Home'

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
    }
  ]
})
