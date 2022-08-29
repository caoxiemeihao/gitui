import {
  type RouteRecordRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import {
  HomeOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'
import Home from './views/home'
import Config from './views/config'
import NotFound from './views/not-found'

export interface MetaRecord {
  title?: string
  icon?: JSX.Element
  show?: boolean
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '首页',
      icon: <HomeOutlined />,
    },
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
    meta: {
      title: '配置',
      icon: <SettingOutlined />,
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
