import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  ReloadOutlined,
  CodeOutlined,
} from '@ant-design/icons-vue'
import { routes } from '@/router'
import { classname } from '@/utils/function'
import './index.less'

export default defineComponent({
  name: 'layout',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()

    return () => (
      <div class='app-layout d-flex h-100'>
        <div class='app-side user-select-none'>
          <div class='menu-item'>
            <div class='logo'>
              <span class='text'>草</span>
              <span class='icon'>
                <CodeOutlined />
              </span>
            </div>
          </div>
          {routes.filter(r => r.meta?.show !== false).map(r => (
            <div class={classname(['menu-item', { active: route.path === r.path }])}>
              <div
                title={r.meta?.title as string}
                class='inner-box'
                onClick={() => router.push(r.path)}
              >
                {r.meta?.icon}
              </div>
            </div>
          ))}
        </div>
        <div class='app-main flex-fill'>
          <div class='app-header'>
            <div class='devtools user-select-none'>
              <div class='btn-group'>
                <ArrowLeftOutlined onClick={() => router.back()} />
                <ArrowRightOutlined onClick={() => router.forward()} />
                <ReloadOutlined onClick={() => location.reload()} />
              </div>
              <input class='ml-2 bg-white' value={route.path} />
            </div>
          </div>
          <div class='app-content'>
            {/* @ts-ignore */}
            {ctx.slots?.default()}
          </div>
        </div>
      </div>
    )
  },
})
