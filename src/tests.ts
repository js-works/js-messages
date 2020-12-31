import { describe, it } from 'mocha'
import { expect } from 'chai'
import { defineMessage, defineMessages, props } from './main'

// === defineMessage =================================================

const action1 = defineMessage('demo.action1')

const action2 = defineMessage('demo.action2', (value: number = 0) => ({
  value
}))

const action3 = defineMessage(
  'demo.action3',
  (value: number = 0, flag: boolean = false) => ({ value, flag })
)

describe('defineMessage', () => {
  it('should create messages with just a type property', () => {
    expect(action1()).to.eql({ type: 'demo.action1' })
  })

  it('should create messages properly with additional properties', () => {
    expect(action2()).to.eql({ type: 'demo.action2', value: 0 })

    expect(action2(2)).to.eql({ type: 'demo.action2', value: 2 })

    expect(action3(42, true)).to.eql({
      type: 'demo.action3',
      value: 42,
      flag: true
    })
  })
})

// === defineMessages ================================================

const Actions = defineMessages({
  action1: null,
  action2: (value: number = 0) => ({ value, flag: true })
})

const Actions2 = defineMessages('category', {
  action1: null,
  action2: (value: number = 0) => ({ value, flag: true })
})

describe('defineMessages', () => {
  it('should create messages without props', () => {
    expect(Actions.action1()).to.eql({ type: 'action1' })
  })

  it('should create messages properly with props', () => {
    expect(Actions.action2()).to.eql({ type: 'action2', value: 0, flag: true })
    expect(Actions.action2(2)).to.eql({ type: 'action2', value: 2, flag: true })
  })
})

describe('defineMessages with category', () => {
  it('should create categorized messages without props', () => {
    expect(Actions2.action1()).to.eql({ type: 'category.action1' })
  })

  it('should create categorized messages properly with props', () => {
    expect(Actions2.action2()).to.eql({
      type: 'category.action2',
      value: 0,
      flag: true
    })
    expect(Actions2.action2(2)).to.eql({
      type: 'category.action2',
      value: 2,
      flag: true
    })
  })
})

// === props =========================================================

const action = defineMessage('someAction', props<{ a: number; b: string }>())

describe('props', () => {
  it('should define messages using the `props` function properly', () => {
    expect(action({ a: 123, b: 'some text' })).to.eql({
      type: 'someAction',
      a: 123,
      b: 'some text'
    })
  })
})
