import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessages from '../../main/api/defineMessages'

const Actions = defineMessages({
  action1: {},
  action2: (value: number = 0) => value,
  
  action3: {
    payload: (value: number = 21) => ({ value })
  },

  action4: {
    payload: (value: number = 42) => ({ value }),
    meta: (value: number = 42) => ({ half: value / 2})
  },

  action5: {
    meta: (value: number = 42) => ({ half: value / 2})
  }
})

const Actions2 = defineMessages({
  action1: {
    type: 'category.action1'
  },

  action2: {
    type: 'category.action2',
    payload: (value: number = 0) => value
  },

  action3: {
    type: 'category.action3',
    payload: (value: number = 21) => ({ value })
  },

  action4: {
    type: 'category.action4',
    payload: (value: number = 42) => ({ value }),
    meta: (value: number = 42) => ({ half: value / 2})
  },

  action5: {
    type: 'category.action5',
    meta: (value: number = 42) => ({ half: value / 2})
  }
} as const)

describe('defineMessages', () => {
  it('should create messages with neither payload nor meta', () => {
    expect(Actions.action1())
      .to.eql({ type: 'action1' })
  })

  it('should create messages properly with payload getter', () => {
    expect(Actions.action2())
      .to.eql({ type: 'action2', payload: 0 })

    expect(Actions.action2(2))
      .to.eql({ type: 'action2', payload: 2 })
   
    expect(Actions.action3())
      .to.eql({ type: 'action3', payload: { value: 21 } })

    expect(Actions.action3(2))
      .to.eql({ type: 'action3', payload: { value: 2 } })
   
    expect(Actions.action4())
      .to.eql({ type: 'action4', payload: { value: 42 }, meta: { half: 21 } })

    expect(Actions.action4(2))
      .to.eql({ type: 'action4', payload: { value: 2 }, meta: { half: 1 } })
    
    expect(Actions.action5(42))
      .to.eql({ type: 'action5', meta: { half: 21 } })
  })
})

describe('defineMessages (alternative syntax)', () => {
  it('should create messages with neither payload nor meta', () => {
    expect(Actions2.action1())
      .to.eql({ type: 'category.action1' })
  })

  it('should create messages properly with payload getter', () => {
    expect(Actions2.action2())
      .to.eql({ type: 'category.action2', payload: 0 })

    expect(Actions2.action2(2))
      .to.eql({ type: 'category.action2', payload: 2 })
   
    expect(Actions2.action3())
      .to.eql({ type: 'category.action3', payload: { value: 21 } })

    expect(Actions2.action3(2))
      .to.eql({ type: 'category.action3', payload: { value: 2 } })
   
    expect(Actions2.action4())
      .to.eql({ type: 'category.action4', payload: { value: 42 }, meta: { half: 21 } })

    expect(Actions2.action4(2))
      .to.eql({ type: 'category.action4', payload: { value: 2 }, meta: { half: 1 } })
    
    expect(Actions2.action5(42))
      .to.eql({ type: 'category.action5', meta: { half: 21 } })
  })
})
