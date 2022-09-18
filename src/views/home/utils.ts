import { invoke } from '@tauri-apps/api'
import { PathStat } from '@/types'

export type Tree = PathStat & {
  child?: Tree[],
  dir_open?: boolean,
  act_class?: 'focused' | 'selected',
  icon?: string,
  level?: number,
}

export async function read_path_stat_list(paths: string[]) {
  const path_stat_list: PathStat[] = []
  for (const path of paths) {
    const res = (await invoke('read_stat', { path })) as PathStat | null
    if (!res) continue
    path_stat_list.push(res)
  }
  return path_stat_list
}

export async function read_dir_stat(path: string) {
  return (await invoke('read_dir_stat', { path })) as PathStat[]
}

export const ICON: {
  file: Record<string, string>,
  folder: Record<string, string>,
} = {
  file: {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'react',
    'tsx': 'react_ts',
    'json': 'json',
    'jsonc': 'json',
    'json5': 'json',
    'html': 'html',
    'txt': 'document',
    'vue': 'vue',
    'gitignore': 'git',
    'md': 'markdown',
    'license': 'certificate',
    'zip': 'zip',
    'tar': 'zip',
    'mp3': 'audio',
    'mp4': 'video',
    'mov': 'video',

    'css': 'css',
    'less': 'less',
    'sass': 'sass',
    'scss': 'sass',
    'styl': 'stylus',

    'png': 'image',
    'jpeg': 'image',
    'jpg': 'image',
    'gif': 'image',
    'ico': 'image',
    'svg': 'svg',
  },
  folder: {
    '.git': 'git',
    '.gitlab': 'folder-gitlab',
    '.vscode': 'folder-vscode',
    'dist': 'folder-dist',
    'log': 'folder-log',
    'logs': 'folder-log',
    'node_modules': 'folder-node',
    'public': 'folder-public',
    'src': 'folder-src',
    'components': 'folder-components',
    'assets': 'folder-resource',
    'hooks': 'folder-hook',
    'styles': 'folder-styles',
    'utils': 'folder-utils',
    'view': 'folder-view',
    'views': 'folder-view',
    'page': 'folder-page',
    'pages': 'folder-page',
    'config': 'folder-config',
    'configs': 'folder-config',
    'home': 'folder-home',
    'typescript': 'folder-typescript',
    'ts': 'folder-typescript',
    'typings': 'folder-typescript',
    '@types': 'folder-typescript',
    'types': 'folder-typescript',
    'vue': 'folder-vue',
    'debug': 'folder-debug',
    'icon': 'folder-icon',
    'icons': 'folder-icon',
  },
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

export function treeWalk(
  tree: Tree,
  cb: (tree: Tree, ancestor: Tree[]) => (Tree | void),
  ancestor: Tree[] = [],
) {
  ancestor = ancestor.concat(tree)
  if (tree.child) {
    tree.child = tree.child.map(t => treeWalk(t, cb, ancestor))
  }

  if (cb) {
    const tmp = cb(tree, ancestor)
    if (tmp) {
      tree = tmp
    }
  }
  return tree
}

treeWalk.async = async function treeWalkAsync(
  tree: Tree,
  cb: (tree: Tree, ancestor: Tree[]) => Promise<Tree | void>,
  ancestor: Tree[] = [],
) {
  ancestor = ancestor.concat(tree)
  if (tree.child) {
    const _child: Tree[] = []
    for (const _tree of tree.child) {
      _child.push(await treeWalkAsync(_tree, cb, ancestor))
    }
    tree.child = _child
  }

  if (cb) {
    const tmp = await cb(tree, ancestor)
    if (tmp) {
      tree = tmp
    }
  }
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
  return files.sort(sortTree.fn).concat(folders.sort(sortTree.fn))
}
sortTree.fn = function fn(a: Tree, b: Tree) {
  const length = Math.max(a.name.length, b.name.length)
  for (let i = 0; i < length; i++) {
    const aCode = a.name.charCodeAt(i)
    const bCode = b.name.charCodeAt(i)
    if (Number.isNaN(aCode)) { // b longer
      return 1
    } else if (Number.isNaN(bCode)) { // a longer
      return -1
    } else {
      return bCode - aCode
    }
  }
  return 0
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
