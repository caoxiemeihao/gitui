import { invoke } from '@tauri-apps/api'
import type { ExecResult } from '@/types'

export async function getUser(
  path: string,
  opts: { global?: boolean; } = {},
) {
  const user = { name: '', email: '' }
  const errors = { name: '', email: '' }
  for (const _key of Object.keys(user)) {
    const key = _key as keyof typeof user
    const { error, output } = await invoke<ExecResult>('exec', {
      path,
      command: 'git',
      args: ['config', opts.global && '--global', `user.${key}`].filter(Boolean),
    })
    if (error) {
      errors[key] = error
    } else {
      user[key] = output!.trim()
    }
  }
  return { user, errors }
}

export async function setUser({
  path,
  name,
  email,
}: {
  path: string,
  name: string,
  email: string,
}) {
  const user = { name, email }
  const errors = { name: '', email: '' }
  for (const [_key, val] of Object.entries(user)) {
    const key = _key as keyof typeof user
    const { error } = await invoke<ExecResult>('exec', {
      path,
      command: 'git',
      args: val
        ? ['config', `user.${key}`, val] // set
        : ['config', '--unset', `user.${key}`], // remove
    })
    if (error) {
      errors[key] = error
    }
  }
  if (errors.email || errors.email) {
    return errors
  }
}
