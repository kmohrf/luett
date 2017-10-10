/* eslint-env mocha */

import bel from 'bel'
import expect from 'must'
import dom, { $, attr } from './dom'

function simpleElement () {
  return bel`
    <div>
        <div id='foo-2' data-component='foo' data-component-lang='de' data-component-lang-fallback='en'></div>
        <div id='foo-1' data-component='foo' data-foo-bar></div>
        <div id='foo-3' data-component='foo' data-component-lang='de' data-foo-lang='en' data-foo-lang-fallback='es'></div>
        <div id='foo-4' data-component='bar' data-foo-bar></div>
    </div>`
}

describe('attr', () => {
  const componentAttr = attr('data-component')
  const langAttr = attr('data-component-lang')

  it('accepts an attribute name and returns that name when casted to a string', () => {
    expect(String(componentAttr))
      .to.equal('data-component')
  })

  it('has a get, set, has, remove, selector, $ and $$ function', () => {
    expect(langAttr.get).to.be.a.function()
    expect(langAttr.set).to.be.a.function()
    expect(langAttr.has).to.be.a.function()
    expect(langAttr.remove).to.be.a.function()
    expect(langAttr.selector).to.be.a.function()
    expect(langAttr.$).to.be.a.function()
    expect(langAttr.$$).to.be.a.function()
  })

  describe('get()', () => {
    it('returns the attribute as string if it was set on the element', () => {
      expect(langAttr.get($('#foo-2', simpleElement())))
        .to.equal('de')
    })

    it('returns the default value if one was provided and the attribute hasn’t been set', () => {
      expect(langAttr.get($('#foo-1', simpleElement()), 'foo'))
        .to.equal('foo')
      expect(langAttr.get($('#foo-2', simpleElement()), 'foo'))
        .to.equal('de')
    })

    it('returns undefined if the attribute was not set on the element', () => {
      expect(langAttr.get($('#foo-1', simpleElement())))
        .to.be.undefined()
    })
  })

  describe('set()', () => {
    it('sets the attribute of an element', () => {
      const el = simpleElement()
      const foo1 = $('#foo-1', el)
      expect(langAttr.get(foo1))
        .to.be.undefined()
      langAttr.set(foo1, 'es')
      expect(langAttr.get(foo1))
        .to.equal('es')
    })

    it('returns the attr object for chaining', () => {
      const el = simpleElement()
      const foo1 = $('#foo-1', el)
      expect(langAttr.set(foo1, 'barbaz').get(foo1))
        .to.equal('barbaz')
    })
  })

  describe('has()', () => {
    it('returns true if the element has the attribute', () => {
      expect(langAttr.has($('#foo-2', simpleElement())))
        .to.be.true()
    })

    it('returns false if the element does not have the attribute', () => {
      expect(langAttr.has($('#foo-1', simpleElement())))
        .to.be.false()
    })
  })

  describe('remove()', () => {
    it('removes the attribute from the element', () => {
      const el = simpleElement()
      const foo2 = $('#foo-2', el)
      expect(langAttr.get(foo2))
        .to.equal('de')
      langAttr.remove(foo2)
      expect(langAttr.has(foo2))
        .to.be.false()
    })

    it('returns the attr object for chaining', () => {
      const el = simpleElement()
      const foo2 = $('#foo-2', el)
      expect(langAttr.remove(foo2).has(foo2))
        .to.be.false()
    })
  })

  describe('selector()', () => {
    it('returns a simple attribute selector when called w/o args', () => {
      expect(langAttr.selector())
        .to.equal('[data-component-lang]')
    })

    it('returns an attribute-value selector with the value if one was passed', () => {
      expect(langAttr.selector('foo'))
        .to.equal('[data-component-lang="foo"]')
    })
  })

  describe('$()', () => {
    it('returns the first element matching the attribute', () => {
      expect(componentAttr.$('foo', simpleElement()).id).to.be('foo-2')
      expect(componentAttr.$('bar', simpleElement()).id).to.be('foo-4')
    })

    it('returns null if no element matches the selector', () => {
      expect(componentAttr.$('foobar', simpleElement())).to.be.null()
    })

    it('allows value to be omitted', () => {
      expect(componentAttr.$(simpleElement())).to.be.an.instanceof(window.HTMLElement)
    })
  })

  describe('$$()', () => {
    it('returns the all elements matching the attribute', () => {
      expect(componentAttr.$$('foo', simpleElement())).to.have.length(3)
      expect(componentAttr.$$('bar', simpleElement())).to.have.length(1)
    })

    it('returns empty list if no element matches the selector', () => {
      expect(componentAttr.$$('foobar', simpleElement())).to.have.length(0)
    })

    it('allows value to be omitted', () => {
      expect(componentAttr.$$(simpleElement())).to.have.length(4)
    })
  })
})
