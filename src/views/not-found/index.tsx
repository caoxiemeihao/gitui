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
        <Alert type='warning' message='404 Not found' />
        <Button type='primary' onClick={() => router.push('/')}>To Home</Button>
      </Card>
    )
  },
})
