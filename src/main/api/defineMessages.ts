import Signature from '../internal/types/Signature'
import MessagesConfig from '../internal/types/MessagesConfig'
import MessageInitializer from '../internal/types/MessageInitializer'

type Func<A extends any[]> = (...args: A) => any

type MessageCreator<K, A extends any[], P, M> = {
  readonly type: K,
  
  (...args: A): {
    type: K,
    payload?: P,
    meta?: M
  }
}

type Sig<A extends any[], I extends MessageInitializer<any>>
  = I extends Func<A>
    ? Signature<I>
    : (I extends { payload: Func<A> }
      ? Signature<I['payload']>
      : []) 

function defineMessages<T extends MessagesConfig>(config: T):
  { [K in keyof T]: MessageCreator<K, Sig<any, T[K]>, any, any> }  {

  const
    ret: any = {},
    keys = Object.keys(config)

  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i]

    if (typeof config[key] === 'function') {
      const getPayload = config[key] as Function
    
      ret[key] = function (/* arguments */) {
        const payload = getPayload.apply(null, arguments)

        return { type: key, payload }
      }
    } else {
      const
        messageConfig = config[key] as { payload?: Function, meta?: Function },
        getPayload = messageConfig.payload,
        getMeta = messageConfig.meta

      ret[key] = function (/* arguments */) {
        const msg: any = { type: key }

        if (getPayload) {
          msg.payload = getPayload.apply(null, arguments)
        }

        if (getMeta) {
          msg.meta = getMeta.apply(null, arguments)
        }

        return msg
      }
    }

    ret[key].type = key
    ret[key].toString = () => key
  }

  return ret
}

export default defineMessages
