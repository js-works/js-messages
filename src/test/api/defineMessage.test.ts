import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessage from '../../main/api/defineMessage'

const
  action1 = defineMessage('demo.action1'),
  action2 = defineMessage('demo.action2', (value: number = 0) => value),

  action3 = defineMessage('demo.action3', {
    payload: (value: number = 21) => ({ value })
  }),

  action4 = defineMessage('demo.action4', {
    payload: (value: number = 42) => ({ value }),
    meta: (value: number = 42) => ({ half: value / 2})
  }),

  action5 = defineMessage('demo.action5', {
    meta: (value: number = 42) => ({ half: value / 2})
  })

describe('defineMessage', () => {
  it('should create messages with neither payload nor meta', () => {
    expect(action1())
      .to.eql({ type: 'demo.action1' })
  })

  it('should create messages properly with payload getter', () => {
    expect(action2())
      .to.eql({ type: 'demo.action2', payload: 0 })

    expect(action2(2))
      .to.eql({ type: 'demo.action2', payload: 2 })
   
    expect(action3())
      .to.eql({ type: 'demo.action3', payload: { value: 21 } })

    expect(action3(2))
      .to.eql({ type: 'demo.action3', payload: { value: 2 } })
   
    expect(action4())
      .to.eql({ type: 'demo.action4', payload: { value: 42 }, meta: { half: 21 } })

    expect(action4(2))
      .to.eql({ type: 'demo.action4', payload: { value: 2 }, meta: { half: 1 } })
    
    expect(action5(42))
      .to.eql({ type: 'demo.action5', meta: { half: 21 } })
  })
})
