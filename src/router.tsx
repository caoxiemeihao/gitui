import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import {
  GithubFilled,
  WindowsFilled,
  SettingFilled,
} from '@ant-design/icons-vue'
import Demo from './views/demo'
import Config from './views/config'
import GitConfig from './views/git-config'
import NotFound from './views/not-found'

export interface MetaRecord {
  title?: string
  icon?: JSX.Element
  show?: boolean
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/git-config',
    name: 'git-config',
    component: GitConfig,
    meta: {
      title: 'Git-配置',
      icon: <GithubFilled />,
    },
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
    meta: {
      title: '配置',
      icon: <SettingFilled />,
    },
  },
  {
    path: '/',
    name: 'demo',
    component: Demo,
    meta: {
      title: 'Demo',
      icon: <WindowsFilled />,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: '404',
      show: false,
    },
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
