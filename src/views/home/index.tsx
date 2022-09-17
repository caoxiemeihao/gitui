import { invoke } from '@tauri-apps/api'
import {
  defineComponent,
  ref,
  watch,
} from 'vue'
import { useDrop } from '@/hooks/useDrop'
import { PathStat } from '@/types'

import './index.less'

type DirRecord = PathStat & { child?: PathStat[] }

export default defineComponent({
  name: 'home',
  setup() {
    const {
      paths,
      UI: ReadPathUI,
    } = useDrop()
    const dirs = ref<DirRecord[]>([])

    watch(paths, async _paths => {
      dirs.value = (await read_path_stat_list(_paths!)).filter(({ is_dir }) => is_dir)
    })

    return () => (
      <div class='view-home h-100 d-flex'>
        <div class='left h-100'>
          {dirs.value.map(dir => dir.name)}
        </div>
        <div class='middle h-100' />
        <div class='right h-100 pr-2 pl-2 flex-fill d-flex flex-column'>
          <div class='current-path'>
            {'/user/asdf/'}
          </div>
          <div class='right-content flex-fill'>
            {ReadPathUI({ style: 'height:calc(100% - 8px);' })}
          </div>
        </div>
      </div>
    )
  },
})

async function read_path_stat_list(paths: string[]) {
  const path_stat_list: PathStat[] = []
  for (const path of paths) {
    const res = (await invoke('read_stat', { path })) as PathStat | null
    if (!res) continue
    path_stat_list.push(res)
  }
  return path_stat_list
}

async function read_dir_stat(path: string) {
  return (await invoke('read_dir_stat', { path })) as PathStat[]
}
