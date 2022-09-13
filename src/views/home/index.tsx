import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'

export default defineComponent({
  name: 'home',
  setup() {
    const readDir = async () => {
      const directory = await open({ directory: true })
      const dirs = await invoke('read_dir', { directory })
      console.log(dirs)
    }

    return () => (
      <div>
        <Button onClick={readDir}>读取文件夹</Button>
      </div>
    )
  },
})
