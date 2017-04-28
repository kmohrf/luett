import { toArray } from './util'
import { $$, setAttr } from './dom'

function upperFirst (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function parseConfig (el, name) {
  const confMatcher = new RegExp(`data-(?:component|${name})-(.+)`, 'i')
  const defaultConf = {}

  toArray(el.attributes).forEach(attr => {
    const match = confMatcher.exec(attr.name)

    if (confMatcher.test(attr.name)) {
      const name = match[1]
        .split('-')
        .reduce((name, part, idx) => name + (idx > 0 ? upperFirst(part) : part), '')
      defaultConf[name] = attr.value
    }
  })

  try {
    const conf = JSON.parse(el.getAttribute('data-component-conf'))
    return Object.assign(defaultConf, conf)
  } catch (e) {
    return defaultConf
  }
}

function transformArgs (name, init, opts) {
  opts = opts instanceof window.HTMLElement ? { root: opts } : opts
  let elements

  if (name instanceof window.NodeList) {
    name = toArray(name)
  }

  if (Array.isArray(name)) {
    elements = name
    name = opts.name || init.NAME

    if (!name) {
      throw Error('provide component name via factory NAME or name option when passing NodeList/Array')
    }
  } else {
    elements = $$(`[data-component~="${name}"]:not([data-component-ready~="${name}"])`, opts.root || document)
  }

  return [elements, name, init, opts]
}

export function component (componentName, componentInit, componentOptions = {}) {
  const [elements, name, init, opts] = transformArgs(componentName, componentInit, componentOptions)

  return elements
    .map((el, index) => {
      const def = (el.dataset.component || '').split(' ')
      const conf = Object.assign({}, init.DEFAULTS || {}, opts.conf || {}, parseConfig(el, name))
      const componentPrefix = `${name}-`

      const options = {
        index,
        conf,
        types: def
          .filter(name => name.indexOf(componentPrefix) === 0)
          .map(name => name.substr(componentPrefix.length))
      }

      const component = init(el, options)
      setAttr(el, 'data-component-ready', name, true)
      return component
    })
}

export default { component }
