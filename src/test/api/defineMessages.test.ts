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
