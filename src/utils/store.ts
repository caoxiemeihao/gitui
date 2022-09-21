
export const local = {
  get<T = any>(key: string): T | null {
    const result = localStorage.getItem(key) as T
    if (result) {
      try {
        return JSON.parse(result as any)
      } catch {
        return result
      }
    }
    return result
  },
  set(key: string, value: any) {
    if (value && typeof value === 'object') {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch { }
    } else {
      localStorage.setItem(key, value)
    }
  },
  remove(key: string) {
    localStorage.removeItem(key)
  },
}
