import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import Home from './views/home'
import Config from './views/config'
import NotFound from './views/not-found'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
