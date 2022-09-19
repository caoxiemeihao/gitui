import { invoke } from '@tauri-apps/api'
import { PathStat } from '@/types'

export function read_stat(path: string) {
  return invoke<PathStat | null>('read_stat', { path })
}

export async function read_stat_list(paths: string[]) {
  const path_stat_list: PathStat[] = []
  for (const path of paths) {
    const res = await invoke<PathStat | null>('read_stat', { path })
    if (!res) continue
    path_stat_list.push(res)
  }
  return path_stat_list
}

/**
 * @deprecated Use `read_dir_stat()` instead it.
 */
export function read_dir(path: string) {
  return invoke<string[]>('read_dir', { path })
}

export function read_dir_stat(path: string) {
  return invoke<PathStat[]>('read_dir_stat', { path })
}
