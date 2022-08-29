import { defineComponent } from 'vue'
import './index.less'

export default defineComponent({
  name: 'layout',
  setup(props, ctx) {

    console.log(ctx)

    return () => (
      <div class='app-layout d-flex h-100'>
        <div class='app-side'></div>
        <div class='app-main flex-fill'>
          {/* @ts-ignore */}
          {ctx.slots?.default()}
        </div>
      </div>
    )
  },
})
