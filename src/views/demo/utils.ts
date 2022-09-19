import { PathStat } from '@/types'
import { ICON } from '@/utils/constant'
import { compareStr } from '@/utils/function'

export type Tree = PathStat & {
  child?: Tree[],
  dir_open?: boolean,
  act_class?: 'focused' | 'selected',
  icon?: string,
  level?: number,
}

export function withIcon(tree: Tree) {
  if (tree.icon) {
    return tree
  }
  if (tree.is_file) {
    const idx = tree.path.lastIndexOf('.')
    const ext = tree.path.slice(idx > -1 ? idx + 1 : 0) // .txt | LICENSE
    tree.icon = ICON.file[ext]
  } else if (tree.is_dir) {
    tree.icon = ICON.folder[tree.name]
  }

  if (!tree.icon) {
    tree.icon = tree.is_file ? 'file' : 'folder'
  }

  tree.icon = tree.icon + '.svg'
  return tree
}

export function sortTree(tree: Tree[]) {
  const folders: Tree[] = []
  const files: Tree[] = []
  for (const t of tree) {
    if (t.is_dir) {
      folders.push(t)
    } else if (t.is_file) {
      files.push(t)
    }
  }
  // 🤔 confused!
  return [
    ...files.sort((a, b) => {
      const str = compareStr(a.name, b.name)
      return typeof str === 'undefined'
        ? 0
        : str === a.name ? -1 : 1
    }),
    ...folders.sort((a, b) => {
      const str = compareStr(a.name, b.name)
      return typeof str === 'undefined'
        ? 0
        : str === a.name ? -1 : 1
    }),
  ]
}

export function expandTree(tree: Tree | Tree[]) {
  const treeList: Tree[] = []
  const _treeList = sortTree(Array.isArray(tree) ? tree : [tree])
  let _tree: Tree | void

  // breadth traversal
  while (_tree = _treeList.pop()) {
    if (!_tree.level) _tree.level = 1
    if (_tree.dir_open && _tree.child) {
      const childList: Tree[] = []
      for (const child of _tree.child) {
        child.level = _tree.level + 1
        childList.push(child)
      }
      _treeList.push(...sortTree(childList))
    }
    treeList.push(_tree)
  }
  return treeList
}
