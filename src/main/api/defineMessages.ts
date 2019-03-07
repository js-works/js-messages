import Signature from '../internal/types/Signature'
import MessagesConfig from '../internal/types/MessagesConfig'

type Func = (...args: any[]) => any

function defineMessages<T extends MessagesConfig>(config: T):
  { [K in keyof T]: (...args: Signature<T[K] extends { payload?: any }  ? T[K]['payload'] : T[K]>) =>
    (T[K] extends Func ? { type: K, payload: ReturnType<T[K]>  } : (T[K] extends { payload?: Func, meta?: Func } ? { type: K, payload?: ReturnType<T[K]['payload']>, meta?: ReturnType<T[K]['meta']> } : never)) } {

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
