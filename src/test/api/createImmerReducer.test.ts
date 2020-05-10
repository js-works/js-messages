import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessages from '../../main/api/defineMessages'
import createImmerReducer from '../../main/api/createImmerReducer'
import when from '../../main/api/when'

const CounterMsg = defineMessages({
  increment: (delta: number = 1) => ({ delta }),
  decrement: (delta: number = 1) => ({ delta }),
  reset: (count: number = 0) => ({ count })
})

const reduce = createImmerReducer({ count: 0 }, [
  when(CounterMsg.increment, (state, { delta }) => {
    state.count += delta
  }),
  
  when(CounterMsg.decrement, (state, { delta }) => {
    state.count -= delta
  }),
  
  when(CounterMsg.reset, (state, { count }) => {
    return { count }
  })
])

describe('createReducer', () => {
  it('should create reducer that handles several message types', () => {
    expect(reduce({ count: 0 }, CounterMsg.increment()))
      .to.eql({ count: 1 })
    
    expect(reduce({ count: 100 }, CounterMsg.increment()))
      .to.eql({ count: 101 })
    
    expect(reduce({ count: 42 }, CounterMsg.decrement(2)))
      .to.eql({ count: 40 })
  })
})
