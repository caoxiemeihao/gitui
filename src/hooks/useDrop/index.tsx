import { open } from '@tauri-apps/api/dialog'
import {
  type Event,
  type UnlistenFn,
  listen,
} from '@tauri-apps/api/event'
import { HTMLAttributes, onUnmounted, ref } from 'vue'
import { Button } from 'ant-design-vue'
import { classname } from '@/utils'

import './index.less'

export type DropType = 'drop' | 'drop_hover' | 'drop_cancelled'
export type DropStatus = 'empty' | 'hover' | 'active'

export function useDrop() {
  const status = ref<DropStatus>('empty')
  const unListen: { [key in DropType]?: UnlistenFn } = {}
  const loading = ref(false)
  const paths = ref<string[]>()

  const openPath = () => {
    loading.value = true
    open({ directory: true, multiple: true })
      .then(dirs => {
        paths.value = dirs as string[]
      })
      .finally(() => loading.value = false)
  }

  listen('tauri://file-drop', (event: Event<string[]>) => {
    paths.value = event.payload
  }).then(fn => unListen.drop = fn)
  listen('tauri://file-drop-hover', () => {
    status.value = 'hover'
  }).then(fn => unListen.drop_hover = fn)
  listen('tauri://file-drop-cancelled', (event: Event<string[]>) => {
    status.value = 'empty'
  }).then(fn => unListen.drop_cancelled = fn)

  onUnmounted(() => {
    for (const key of Object.keys(unListen)) {
      unListen[key as DropType]!()
    }
  })

  return {
    paths,
    // FC 跟随渲染
    UI: (attrs?: Partial<HTMLAttributes>) => (
      <div
        class={classname([
          'hooks-use-drop',
          paths.value ? 'active' : status.value,
          'd-flex',
          'justify-content-center',
          'align-items-center',
        ])}
        {...attrs}
      >
        <div class='text-center'>
          <Button
            loading={loading.value}
            type='primary'
            onClick={openPath}
          >读取文件夹</Button>
          <div class='text mt-4'>拖拽文件夹至此</div>
        </div>
      </div>
    ),
  }
}
