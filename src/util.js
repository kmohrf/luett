export function toArray (iterable) {
  return [].slice.call(iterable)
}

export function mapCall (list, action, ...args) {
  return list.map(item => action(item, ...args))
}

export default { toArray, mapCall }
