import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const routes = [{
  path: '/',
  name: 'tickets',
  component: defineAsyncComponent(() => import('@pages/Tickets.vue')),
  alias: ['/tickets'],
  children: [{
    path: ':id',
    name: 'ticket',
    component: defineAsyncComponent(() => import('@pages/Ticket.vue'))
  }]
}, {
  path: '/details',
  name: 'details',
  component: defineAsyncComponent(() => import('@pages/Details.vue'))
}, {
  path: '/dashboard',
  name: 'dashboard',
  component: defineAsyncComponent(() => import('@pages/Dashboard.vue'))
}, {
  path: '/coupons',
  name: 'coupons',
  component: defineAsyncComponent(() => import('@pages/Coupons.vue'))
}, {
  path: '/groups',
  name: 'groups',
  component: defineAsyncComponent(() => import('@pages/Groups.vue'))
}, {
  path: '/roles',
  name: 'roles',
  component: defineAsyncComponent(() => import('@pages/Roles.vue'))
}, {
  path: '/reasons',
  name: 'reasons',
  component: defineAsyncComponent(() => import('@pages/Reasons.vue'))
}, {
  path: '/users',
  name: 'users',
  component: defineAsyncComponent(() => import('@pages/Users.vue'))
}, {
  path: '/:pathMatch(.*)',
  redirect: '/',
}]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
