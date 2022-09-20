import { createApp } from 'vue'
import router from './router'
import App from './App'

import 'ant-design-vue/dist/antd.css'
import './styles/classify.css'
import './styles/global.css'

createApp(App)
  .use(router)
  .mount('#app')
