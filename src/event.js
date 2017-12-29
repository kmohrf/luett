const DEFAULT_KEY_MODIFIERS = { shiftKey: false, ctrlKey: false, altKey: false }

export function keyPressed (keyCode, modifiers, callback) {
  if (typeof modifiers === 'function') {
    callback = modifiers
    modifiers = Object.assign({}, DEFAULT_KEY_MODIFIERS)
  } else {
    modifiers = Object.assign({}, DEFAULT_KEY_MODIFIERS, modifiers)
  }

  return function (event) {
    // proper event?
    if (!event) {
      return
    }
    // correct keyCode?
    if (event.keyCode !== keyCode) {
      return
    }

    // correct modifiers?
    if (Object.keys(modifiers).reduce((result, name) => result && event[name] === modifiers[name], true) !== true) {
      return
    }

    callback.apply(this, arguments)
  }
}

keyPressed.return = keyPressed.bind(null, 13)

export function matchesMedia (query, matchesCallback, notMatchesCallback) {
  return function () {
    if (window.matchMedia(query).matches) {
      matchesCallback.apply(this, arguments)
    } else {
      if (notMatchesCallback) {
        notMatchesCallback.apply(this, arguments)
      }
    }
  }
}

matchesMedia.min = {}
matchesMedia.min.small = matchesMedia.bind(null, '(min-width: 768px)')
matchesMedia.min.medium = matchesMedia.bind(null, '(min-width: 992px)')
matchesMedia.min.large = matchesMedia.bind(null, '(min-width: 1200px)')
matchesMedia.min.hd = matchesMedia.bind(null, '(min-width: 1920px)')
matchesMedia.max = {}
matchesMedia.max.small = matchesMedia.bind(null, '(max-width: 767px)')
matchesMedia.max.medium = matchesMedia.bind(null, '(max-width: 991px)')
matchesMedia.max.large = matchesMedia.bind(null, '(max-width: 1199px)')
matchesMedia.max.hd = matchesMedia.bind(null, '(max-width: 1919px)')

export function on (el, event, callback, options = false) {
  const events = typeof event === 'string' ? [event] : event
  events.forEach(event => el.addEventListener(event, callback, options))
  return {
    destroy: () => {
      events.forEach(event => el.removeEventListener(event, callback, options))
    }
  }
}

export default { keyPressed, matchesMedia, on }
