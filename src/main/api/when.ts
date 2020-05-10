import State from '../internal/types/State'
import Message from '../internal/types/Message'

export default function when<T extends string, P, M, S extends State>(
  messageCreator: MessageCreator<T, P, M>,
  reduce: (state: S, payload: P, meta: M) => Partial<S> | void
) {
  return {
    type: messageCreator.type,
    
    handle(state: S, msg: Message) {
      return msg && msg.type === messageCreator.type
        ? reduce(state, msg.payload, msg.meta)
        : undefined
    }
  }
}

// -------------------------------------------------------------------

type MessageCreator<T extends string, P, M> = {
  (...args: any[]): {
    type: T,
    payload?: P,
    meta?: M 
  }

  type: T
}