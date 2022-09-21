import { read_dir_stat } from '@/utils/fs'
import { getUser } from '@/utils/git'

export interface RecordGit {
  path: string
  name: string
  email: string
}

/**
 * 与 VSCode 行为保持一致
 * 
 * 1. 当前目录如果有 .git 仓库，只读取当前目录
 * 2. 如果当前目录无 .git 仓库，读取一级子目录
 */
export async function readGitRepository(path: string): Promise<string | string[] | undefined> {
  const GIT = '.git'
  const exclude = ['node_modules']
  const dirs = await read_dir_stat(path)
  if (dirs.find(dir => dir.is_dir && dir.name === GIT)) {
    return path
  }

  const paths: string[] = []
  for (const dir of dirs) {
    if (!dir.is_dir) continue
    if (exclude.includes(dir.name)) continue
    const dirs2 = await read_dir_stat(dir.path)
    if (dirs2.find(dir2 => dir2.is_dir && dir2.name === GIT)) {
      paths.push(dir.path)
    }
  }
  if (paths.length) {
    return paths
  }
}

export async function path2git(path: string) {
  let cache = path2git.cache.get(path)
  if (!cache) {
    const { user } = await getUser(path)
    cache = { path, ...user }
    path2git.cache.set(path, cache)
  }
  return cache
}
path2git.cache = new Map<string, RecordGit>()

export function path2name(path: string) {
  return path.slice(path.lastIndexOf('/') + 1)
}
