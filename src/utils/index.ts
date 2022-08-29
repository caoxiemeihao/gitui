
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
