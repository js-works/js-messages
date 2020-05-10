import { produce } from 'immer'

import hasOwnProp from '../internal/hasOwnProp'
import State from '../internal/types/State'
import Message from '../internal/types/Message'
import When from '../internal/types/When'

export default function createImmerReducer<S extends State>(initialState: S, whens: When<S>[]) {
  const reducers: any = {}

  whens.forEach(({ type, handle}) => {
    reducers[type] = handle
  })

  return (state = initialState, msg: Message): S => {
    let ret = state

    if (msg && hasOwnProp(msg, 'type') && hasOwnProp(reducers, msg.type)) {
      ret = produce(state, state => reducers[msg.type](state, msg))
    }

    return ret
  }
}
