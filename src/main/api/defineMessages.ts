import Signature from '../internal/types/Signature'
import MessagesConfig from '../internal/types/MessagesConfig'
import MessageInitializer from '../internal/types/MessageInitializer'
import MessageCreator from '../internal/types/MessageCreator'
import buildMessageCreator from '../internal/buildMessageCreator';

type Func<A extends any[], R> = (...args: A) => R

type MessageCreatorType<T, X extends MessageInitializer<any>> =
  X extends Func<infer A, infer P>
    ? { (...args: A): { type: T, payload: P }, type: T }
    : X extends { payload: Func<infer A, infer P>, meta: Func<infer A, infer M> }
      ? { (...args: A): { type: T, payload: P, meta: M }, type: T }
      : X extends { payload: Func<infer A, infer P> }
        ? { (...args: A): { type: T, payload: P }, type: T }
        : X extends { meta: Func<infer A, infer M> }
          ? { (...args: A): { type: T, meta: M }, type: T }
          : { (): { type: T }, type: T }

function defineMessages<C extends MessagesConfig>(config: C):
  { [T in keyof C]: MessageCreatorType<T, C[T]> }  {

  const
    ret: any = {},
    keys = Object.keys(config)

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]

    ret[key] = buildMessageCreator(key, config[key])
  }

  return ret
}

export default defineMessages
