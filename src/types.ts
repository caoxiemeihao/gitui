
export interface PathStat {
  is_dir: boolean
  is_file: boolean
  path: string
  name: string
}

export interface ExecResult {
  error: null | string
  output: null | string
}
