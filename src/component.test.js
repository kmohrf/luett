/* eslint-env mocha */
/* global expect:false */

import bel from 'bel'
import { component } from './component'

function simpleElement () {
  return bel`
    <div>
        <div id='foo-1' data-component='foo' data-foo-bar></div>
        <div id='foo-2' data-component='foo' data-component-lang='de'></div>
        <div id='foo-3' data-component='foo' data-component-lang='de' data-foo-lang='en'></div>
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
    expect(components)
      .to.be.an('array')
      .to.have.lengthOf(3)

    expect(components[0]).to.have.deep.property('factory', simpleComponent)
  })

  it('passes an element and options object to the factory', () => {
    let callArgs
    component('foo', (...args) => { callArgs = args }, simpleElement())
    expect(callArgs).to.have.lengthOf(2)
    expect(callArgs[0]).to.be.an.instanceof(window.HTMLElement)
    expect(callArgs[1]).to.be.an('object')
  })

  it('adds the component name to the componentReady dataset of the element', () => {
    expect(components[0]).to.have.deep.property('el.dataset.componentReady').that.contains('foo')
  })

  it('stores the index of the processed element inside the options', () => {
    expect(components[0]).to.have.deep.property('opts.index', 0)
    expect(components[1]).to.have.deep.property('opts.index', 1)
    expect(components[2]).to.have.deep.property('opts.index', 2)
  })

  describe('the passed options.conf object', () => {
    it('merges the factory defaults', () => {
      expect(components[0]).to.have.deep.property('opts.conf.lang', simpleComponent.DEFAULTS.lang)
    })

    it('merges options provided on component call', () => {
      const components = component('foo', simpleComponent, { root: simpleElement(), conf: { lang: 'fr' } })
      expect(components[0]).to.have.deep.property('opts.conf.lang', 'fr')
      expect(components[1]).to.have.deep.property('opts.conf.lang', 'de')
    })

    it('merges options provided via data-component-* attributes', () => {
      expect(components[1]).to.have.deep.property('opts.conf.lang', 'de')
    })

    it('merges options provided via data-$name-* attributes', () => {
      expect(components[2]).to.have.deep.property('opts.conf.lang', 'en')
    })
  })

  describe('NodeList/Array instead of a name', () => {
    function create (...args) {
      return component(simpleElement().querySelectorAll('div'), ...args)
    }

    it('uses the NAME attribute from the init function', () => {
      expect(create(simpleComponent))
        .to.have.deep.property('[0].el.dataset.componentReady')
        .that.contains(simpleComponent.NAME)
    })

    it('or the name attribute from the provided options', () => {
      expect(create(el => ({ el }), { name: 'herold' }))
        .to.have.deep.property('[0].el.dataset.componentReady')
        .that.contains('herold')
    })

    it('throws an exception if neither is provided', () => {
      expect(() => create(() => {})).to.throw(Error, /provide component name/)
    })
  })
})
