import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessages from '../../main/api/defineMessages'
import createReducer from '../../main/api/createReducer'
import when from '../../main/api/when'

const CounterMsg = defineMessages({
  increment: (delta: number = 1) => ({ delta }),
  decrement: (delta: number = 1) => ({ delta }),
  reset: (count: number = 0) => ({ count })
})

const reduce = createReducer({ count: 0 }, [
  when(CounterMsg.increment, (state, { delta }) => {
    return { count: state.count + delta }
  }),
  
  when(CounterMsg.decrement, (state, { delta }) => {
    return { count: state.count - delta }
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

    expect(reduce({ count: 100 }, CounterMsg.reset()))
      .to.eql({ count: 0 })
    
    expect(reduce({ count: 200 }, CounterMsg.reset(100)))
      .to.eql({ count: 100 })
  })
})
