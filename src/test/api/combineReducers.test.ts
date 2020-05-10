import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessages from '../../main/api/defineMessages'
import createReducer from '../../main/api/createReducer'
import combineReducer from '../../main/api/combineReducers'
import when from '../../main/api/when'

const CounterMsg = defineMessages({
  increment: (delta: number = 1) => ({ delta })
})

const counterReducer = createReducer({ count: 0 }, [
  when(CounterMsg.increment, (state, { delta }) => {
    return { count: state.count + delta }
  }),
])

const doubleCounterReducer = createReducer({ count: 0}, [
  when(CounterMsg.increment, (state, { delta }) => {
    return { count: state.count + 2 * delta }
  })
])

const reduce = combineReducer({ counter: counterReducer, doubleCounter: doubleCounterReducer })

describe('combineReduders', () => {
  it('should combine serveral reducers to one single reducer', () => {
    expect(reduce({ counter: { count: 0 }, doubleCounter: { count: 0 } }, CounterMsg.increment(10)))
      .to.eql({ counter: { count: 10 }, doubleCounter: { count: 20 } })
  })
})
