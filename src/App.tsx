import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Layout from './components/layout'

export default defineComponent({
  setup() {

    return () => (
      <Layout>
        <RouterView />
      </Layout>
    )
  },
})
