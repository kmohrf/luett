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

export function className (name) {
  return {
    add: (el, ...args) => {
      addClass(el, ...args.concat(name))
      return this
    },
    remove: (el, ...args) => {
      removeClass(el, ...args.concat(name))
      return this
    },
    toggle: (el, force = undefined) => {
      toggleClass(el, name, force)
      return this
    },
    selector: () => `.${name}`,
    toString: () => name
  }
}

export function addClass (el, ...args) {
  el.classList.add(...args)
  return el
}

export function toggleClass (el, className, force = undefined) {
  el.classList.toggle(className, force)
  return el
}

export function removeClass (el, ...args) {
  el.classList.remove(...args)
  return el
}

export function attr (name) {
  return {
    get: (el, ...args) => getAttr(el, name, ...args),
    set: (el, ...args) => {
      setAttr(el, name, ...args)
      return this
    },
    has: el => hasAttr(el, name),
    selector: (value = undefined) => `[${name}${value ? `="${value}"` : ''}]`,
    toString: () => name
  }
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

export default {
  $,
  $$,
  id,
  replace,
  index,
  remove,
  rect,
  className,
  addClass,
  toggleClass,
  removeClass,
  attr,
  getAttr,
  setAttr,
  hasAttr,
  insertElement
}
