import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from 'ant-design-vue'

export default defineComponent({
  name: 'home',
  setup() {
    const router = useRouter()

    return () => (
      <div>
        Home Component
        <Button onClick={() => router.push('/config')}>Config</Button>
      </div>
    )
  },
})
