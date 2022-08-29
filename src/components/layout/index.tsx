import { computed, defineComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes } from '@/router'
import { classname } from '@/utils'
import './index.less'

export default defineComponent({
  name: 'layout',
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const menus = ref()

    const genMenus = () => routes.filter(r => r.meta?.show !== false).map(r => (
      <div class={classname(['menu-item', { active: route.path === r.path }])}>
        <div
          title={r.meta?.title as string}
          class='inner-box'
          onClick={() => router.push(r.path)}
        >
          {r.meta?.icon}
        </div>
      </div>
    ))

    watch(() => route.path, () => menus.value = genMenus(), { immediate: true })

    return () => (
      <div class='app-layout d-flex h-100'>
        <div class='app-side'>
          <div class='menu-item'>
            <div class='logo'>草</div>
          </div>
          {menus.value}
        </div>
        <div class='app-main flex-fill'>
          {/* @ts-ignore */}
          {ctx.slots?.default()}
        </div>
      </div>
    )
  },
})
