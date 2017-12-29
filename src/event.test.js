/* eslint-env mocha */

import bel from 'bel'
import expect from 'must'
import simple from 'simple-mock'
import { on } from './event'

function simpleElement () {
  return bel`<div></div>`
}

function createEvent (type) {
  try {
    return new window.Event(type)
  } catch (e) {
    const event = document.createEvent('Event')
    event.initEvent(type, true, true)
    return event
  }
}

describe('on', () => {
  it('registers an event listener', function (done) {
    this.timeout(100)
    const el = simpleElement()
    on(el, 'click', () => done())
    el.dispatchEvent(createEvent('click'))
  })

  it('returns a listener object with a destroy method', () => {
    const el = simpleElement()
    const listener = on(el, 'click', () => {})
    expect(listener).to.be.an.object()
    expect(listener.destroy).to.be.a.function()
  })

  it('deregisters event listeners when destroy is called', function (done) {
    this.timeout(100)
    const el = simpleElement()
    const spy = simple.spy(() => {})
    const listener = on(el, 'click', spy)
    el.dispatchEvent(createEvent('click'))
    el.dispatchEvent(createEvent('click'))
    listener.destroy()
    el.dispatchEvent(createEvent('click'))
    expect(spy.callCount).to.be(2)
    done()
  })

  it('transparently handles an array for event', function (done) {
    this.timeout(100)
    const el = simpleElement()
    const spy = simple.spy(() => {})
    const listener = on(el, ['click', 'focus'], spy)
    el.dispatchEvent(createEvent('click'))
    el.dispatchEvent(createEvent('focus'))
    el.dispatchEvent(createEvent('blur'))
    listener.destroy()
    el.dispatchEvent(createEvent('click'))
    expect(spy.callCount).to.be(2)
    done()
  })
})
