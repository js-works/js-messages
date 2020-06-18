import { describe, it } from 'mocha'
import { expect } from 'chai'

import { defineMessages } from '../../main/index'

const Actions = defineMessages({
  action1: null,
  action2: (value: number = 0) => ({ value, flag: true })
})

describe('defineMessages', () => {
  it('should create messages with out props', () => {
    expect(Actions.action1()).to.eql({ type: 'action1' })
  })

  it('should create messages properly with props', () => {
    expect(Actions.action2()).to.eql({ type: 'action2', value: 0, flag: true })
    expect(Actions.action2(2)).to.eql({ type: 'action2', value: 2, flag: true })
  })
})
