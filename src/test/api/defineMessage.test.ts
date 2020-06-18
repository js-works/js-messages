import { describe, it } from 'mocha'
import { expect } from 'chai'

import { defineMessage } from '../../main/index'

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
