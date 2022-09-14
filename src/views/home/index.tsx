import { invoke } from '@tauri-apps/api'
import { open } from '@tauri-apps/api/dialog'
import { defineComponent } from 'vue'
import { Button } from 'ant-design-vue'

interface DirStat {
  is_dir: boolean
  is_file: boolean
  path: string
  file_name: string
}

export default defineComponent({
  name: 'home',
  setup() {
    const readDir = async () => {
      const directory = await open({ directory: true })
      const dirs: DirStat[] = await invoke('read_dir_stats', { directory })
      console.log(dirs)
    }

    return () => (
      <div>
        <Button onClick={readDir}>读取文件夹</Button>
      </div>
    )
  },
})
