import {
  defineComponent,
  ref,
  watch,
} from 'vue'
import { RightOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useDrop } from '@/hooks/useDrop'
import { read_dir_stat, read_stat_list } from '@/utils/fs'
import { walk } from '@/utils/function'
import { classname } from '@/utils/function'
import {
  type Tree,
  expandTree,
  withIcon,
} from './utils'

import './index.less'

export default defineComponent({
  name: 'demo',
  setup() {
    const {
      paths,
      UI: ReadPathUI,
    } = useDrop()
    const dirs = ref<Tree[]>([])
    const currentPath = ref('')

    const clickTreeDelegate = async (event: MouseEvent) => {
      const dom = event.target as HTMLElement

      if (dom.dataset.path) {
        currentPath.value = dom.dataset.path
      }

      const _dirs: Tree[] = []
      for (const dir of dirs.value) {
        _dirs.push(await walk.async<Tree>(dir, async (tree, ancestor) => {
          if (tree.path === dom.dataset.path) {
            tree.act_class = 'selected'
            if (tree.is_dir) {
              if (tree.dir_open) {
                tree.dir_open = false
              } else {
                tree.dir_open = true
                if (!tree.child) {
                  tree.child = await read_dir_stat(tree.path)
                }
              }
            }
          } else {
            tree.act_class = void 0
          }
        }))
      }
      dirs.value = _dirs
    }

    watch(paths, async _paths => {
      dirs.value = (await read_stat_list(_paths!)).filter(({ is_dir }) => is_dir)
    })

    const renderTree = (tree: Tree) => {
      withIcon(tree)
      return (
        <div
          key={tree.path}
          data-path={tree.path}
          class={classname([
            'tree-item',
            'd-flex',
            'align-items-center',
            'cursor-pointer',
            'position-relative',
            'user-select-none',
            tree.act_class,
          ].filter(Boolean) as string[])}
          style={`padding-left: ${tree.level! * 8}px;`}
          title={tree.name}
        >
          <div class='tree-expand icon text-center'>
            {tree.is_dir
              ? (tree.dir_open ? <DownOutlined /> : <RightOutlined />)
              : null}
          </div>
          <div
            class='tree-theme icon'
            style={`background:url(./icons/${tree.icon});`}
          />
          <div class='tree-name ml-1 text-truncate flex-fill'>{tree.name}</div>
        </div>
      )
    }

    return () => (
      <div class='view-home h-100 d-flex'>
        <div class='left h-100 overflow-auto' onClick={clickTreeDelegate}>
          {/* TODO: Re-rendering optimize */}
          {expandTree(JSON.parse(JSON.stringify(dirs.value))).map((dir: Tree) => renderTree(dir))}
          <div class='pb-4' />
        </div>
        <div class='middle h-100' />
        <div class='right position-relative h-100 flex-fill d-flex flex-column overflow-auto'>
          <div class='breadcrumbs pl-2 user-select-none'>
            {currentPath.value}
          </div>
          <div class='presentation position-absolute w-100' />
          <div class='right-content flex-fill p-2'>
            {ReadPathUI({ class: 'h-100 user-select-none' })}
          </div>
        </div>
      </div>
    )
  },
})
