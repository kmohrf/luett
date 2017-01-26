import { toArray } from './util'

export function $ (selector, el = document) {
  return el.querySelector(selector)
}

export function $$ (selector, el = document) {
  return toArray(el.querySelectorAll(selector))
}

export function id (name, el = document) {
  return el.getElementById(name)
}

export function replace (oldElement, newElement) {
  oldElement.parentNode.replaceChild(newElement, oldElement)
  return newElement
}

export function index (el) {
  let idx = 0
  while (el) {
    idx++
    el = el.previousElementSibling
  }
  return idx
}

export function remove (el) {
  el.parentNode && el.parentNode.removeChild(el)
  return el
}

export function rect (el) {
  const rect = el.getBoundingClientRect()

  return {
    top: window.pageYOffset + rect.top,
    left: window.pageXOffset + rect.left,
    width: rect.width,
    height: rect.height
  }
}

export function addClass (el, clazz) {
  el.classList.add(clazz)
  return el
}

export function toggleClass (el, clazz, force = undefined) {
  el.classList.toggle(clazz, force)
  return el
}

export function removeClass (el, clazz) {
  el.classList.remove(clazz)
  return el
}

export function getAttr (el, name, defaultValue = undefined) {
  return el && el.hasAttribute(name) ? el.getAttribute(name) : defaultValue
}

export function setAttr (el, name, value, append = false) {
  const attrValue = append ? getAttr(el, name, '') + ' ' + value : value
  el.setAttribute(name, attrValue)
  return el
}

export function hasAttr (el, name) {
  return el && el.hasAttribute(name)
}

export function insertElement (position, node, newNode) {
  switch (position) {
    case 'beforebegin':
      node.parentNode.insertBefore(newNode, node)
      break
    case 'afterend':
      node.parentNode.insertBefore(newNode, node.nextElementSibling)
      break
  }

  return newNode
}

insertElement.before = (node, newNode) => insertElement('beforebegin', node, newNode)
insertElement.after = (node, newNode) => insertElement('afterend', node, newNode)

export function component (name, init, opts = {}) {
  function parseConfig (el) {
    const confMatcher = new RegExp(`data-(?:component|${name})-([^-]+)`, 'i')
    const defaultConf = {}

    toArray(el.attributes).forEach(attr => {
      const match = confMatcher.exec(attr.name)

      if (confMatcher.test(attr.name)) {
        defaultConf[match[1]] = attr.value
      }
    })

    try {
      const conf = JSON.parse(el.getAttribute('data-component-conf'))
      return Object.assign(defaultConf, conf)
    } catch (e) {
      return defaultConf
    }
  }

  opts = opts instanceof window.HTMLElement ? { root: opts } : opts

  return $$(`[data-component~="${name}"]:not([data-component-ready~="${name}"])`, opts.root || document)
        .map((el, index) => {
          const def = el.getAttribute('data-component').split(' ')
          const conf = Object.assign({}, init.DEFAULTS || {}, opts.conf || {}, parseConfig(el))
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

export default {
  $,
  $$,
  id,
  component,
  replace,
  index,
  remove,
  rect,
  addClass,
  toggleClass,
  removeClass,
  getAttr,
  setAttr,
  hasAttr,
  insertElement
}
