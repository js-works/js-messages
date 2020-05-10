import Func from './Func'
import MessageInitializer from './MessageInitializer'

type MessageCreatorType<T /* extends string */, I extends MessageInitializer<any[]>> = // TODO
  I extends Func<infer A, infer P>
    ? { (...args: A): { type: T, payload: P }, type: T }
    : I extends { payload: Func<infer A, infer P>, meta: Func<infer A, infer M> }
      ? { (...args: A): { type: T, payload: P, meta: M }, type: T }
      : I extends { payload: Func<infer A, infer P> }
        ? { (...args: A): { type: T, payload: P }, type: T }
        : I extends { meta: Func<infer A, infer M> }
          ? { (...args: A): { type: T, meta: M }, type: T }
          : { (): { type: T }, type: T }

export default MessageCreatorType
