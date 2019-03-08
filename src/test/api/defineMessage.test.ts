import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessage from '../../main/api/defineMessage'

const
  action1 = defineMessage('ACTION1'),
  action2 = defineMessage('ACTION2', (value: number = 0) => value),
  action3 = defineMessage('ACTION3', (value: number = 21) => ({ value })),
  
  action4 = defineMessage('ACTION4', {
    payload: (value: number = 42) => ({ value }),
    meta: (value: number = 42) => ({ half: value / 2})
  })

describe('defineMessage', () => {
  it('should create messages with neigther payload nor meta', () => {
    expect(action1())
      .to.eql({ type: 'ACTION1' })
  })

  it('should create messages properly with payload getter', () => {
    expect(action2())
      .to.eql({ type: 'ACTION2', payload: 0 })

    expect(action2(2))
      .to.eql({ type: 'ACTION2', payload: 2 })
   
    expect(action3())
      .to.eql({ type: 'ACTION3', payload: { value: 21 } })

    expect(action3(2))
      .to.eql({ type: 'ACTION3', payload: { value: 2 } })
   
    expect(action4())
      .to.eql({ type: 'ACTION4', payload: { value: 42 }, meta: { half: 21 } })

    expect(action4(2))
      .to.eql({ type: 'ACTION4', payload: { value: 2 }, meta: { half: 1 } })
  })
})
