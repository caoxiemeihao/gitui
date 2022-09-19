import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import {
  Alert,
  Button,
  Card,
} from 'ant-design-vue'

export default defineComponent({
  name: 'not-found',
  setup() {
    const router = useRouter()

    return () => (
      <Card style='text-align:center;'>
        <div style='margin-top:24vh;'>
          <Alert type='warning' message='404 Not found' />
          <Button
            type='primary'
            style='margin-top:15px;'
            onClick={() => router.push('/')}
          >To Home</Button>
        </div>
      </Card>
    )
  },
})
