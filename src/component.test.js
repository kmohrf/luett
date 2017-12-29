/* eslint-env mocha */

import bel from 'bel'
import expect from 'must'
import { component } from './component'

function simpleElement () {
  return bel`
    <div>
        <div id='foo-1' data-component='foo' data-foo-bar></div>
        <div id='foo-2' data-component='foo' data-component-lang='de' data-component-lang-fallback='en'></div>
        <div id='foo-3' data-component='foo' data-component-lang='de' data-foo-lang='en' data-foo-lang-fallback='es'></div>
    </div>`
}

function simpleComponent (el, opts) {
  return { el, opts, factory: simpleComponent }
}
simpleComponent.NAME = 'heinrich'
simpleComponent.DEFAULTS = { lang: 'es' }

describe('component', () => {
  const components = component('foo', simpleComponent, simpleElement())

  it('accepts a name, looks for [data-component="$name"] elements and returns them initialized', () => {
    expect(components).to.be.an.array()
    expect(components).to.have.length(3)

    expect(components[0].factory).to.equal(simpleComponent)
  })

  it('passes an element and options object to the factory', () => {
    let callArgs = null
    component('foo', (...args) => { callArgs = args }, simpleElement())
    expect(callArgs).to.have.length(2)
    expect(callArgs[0]).to.be.an.instanceof(window.HTMLElement)
    expect(callArgs[1]).to.be.an.object()
  })

  it('adds the component name to the componentReady dataset of the element', () => {
    expect(components[0].el.dataset.componentReady).to.contain('foo')
  })

  it('stores the index of the processed element inside the options', () => {
    expect(components[0].opts.index).to.be(0)
    expect(components[1].opts.index).to.be(1)
    expect(components[2].opts.index).to.be(2)
  })

  describe('the passed options.conf object', () => {
    it('merges the factory defaults', () => {
      expect(components[0].opts.conf.lang).to.be(simpleComponent.DEFAULTS.lang)
    })

    it('merges options provided on component call', () => {
      const components = component('foo', simpleComponent, { root: simpleElement(), conf: { lang: 'fr' } })
      expect(components[0].opts.conf.lang).to.be('fr')
      expect(components[1].opts.conf.lang).to.be('de')
    })

    it('merges options provided via data-component-* attributes', () => {
      expect(components[1].opts.conf.lang).to.be('de')
      expect(components[1].opts.conf.langFallback).to.be('en')
    })

    it('merges options provided via data-$name-* attributes', () => {
      expect(components[2].opts.conf.lang).to.be('en')
      expect(components[2].opts.conf.langFallback).to.be('es')
    })
  })

  describe('NodeList/Array instead of a name', () => {
    function create (...args) {
      return component(simpleElement().querySelectorAll('div'), ...args)
    }

    it('uses the NAME attribute from the init function', () => {
      expect(create(simpleComponent)[0].el.dataset.componentReady)
        .to.contain(simpleComponent.NAME)
    })

    it('or the name attribute from the provided options', () => {
      expect(create(el => ({ el }), { name: 'herold' })[0].el.dataset.componentReady)
        .to.contain('herold')
    })

    it('throws an exception if neither is provided', () => {
      expect(() => create(() => {})).to.throw(Error, /provide component name/)
    })
  })
})
