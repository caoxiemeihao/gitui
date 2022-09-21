export function classname(cls: Record<string, boolean> | (string | Record<string, boolean>)[]) {
  return (Array.isArray(cls) ? cls : [cls])
    .map(c => {
      if (typeof c === 'string') {
        return c
      }
      const [name, bool] = Object.entries(c)[0]
      return bool && name
    })
    .filter(Boolean)
    .join(' ')
}

/**
 * ```
 * a > b => a
 * a < b => b
 * a = b => undefined
 * ```
 */
export function compareStr(a: string, b: string) {
  const length = Math.max(a.length, b.length)
  for (let i = 0; i < length; i++) {
    const aCode = a.charCodeAt(i)
    const bCode = b.charCodeAt(i)
    if (Number.isNaN(aCode)) { // b longer
      return b
    } else if (Number.isNaN(bCode)) { // a longer
      return a
    } else {
      return bCode - aCode > 0 ? b : a
    }
  }
}

export function walk<T extends Record<string, any> = any>(
  tree: T,
  cb: (tree: T, ancestor: T[]) => (T | void),
  ancestor: T[] = [],
) {
  ancestor = ancestor.concat(tree)
  for (const key of Object.keys(tree)) {
    const value = tree[key]
    if (Array.isArray(value)) {
      (tree as Record<string, any>)[key] = value.map(e => walk<T>(e, cb, ancestor))
    }
  }

  if (cb) {
    const tmp = cb(tree, ancestor)
    if (tmp) {
      tree = tmp
    }
  }
  return tree
}

walk.async = async function walkAsync<T extends Record<string, any> = any>(
  tree: T,
  cb: (tree: T, ancestor: T[]) => Promise<T | void>,
  ancestor: T[] = [],
) {
  ancestor = ancestor.concat(tree)
  for (const key of Object.keys(tree)) {
    const value = tree[key]
    if (Array.isArray(value)) {
      const _value: T[] = []
      for (const val of value) {
        _value.push(await walkAsync(val, cb, ancestor))
      }
      (tree as Record<string, any>)[key] = _value
    }
  }

  if (cb) {
    const tmp = await cb(tree, ancestor)
    if (tmp) {
      tree = tmp
    }
  }
  return tree
}
