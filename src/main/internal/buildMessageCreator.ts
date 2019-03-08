import MessageInitializer from './types/MessageInitializer'
import MessageCreator from './types/MessageCreator'

export default function buildMessageCreator<K extends String, A extends any[]>
  (type: K, initializer: MessageInitializer<A> = null): MessageCreator<K, A, any, any> {
  
  let ret: any

  if (!initializer) {
   const msg = Object.freeze({ type })

    ret = () => msg
  } else if (typeof initializer === 'function') {
    const getPayload = initializer as Function
    
    ret = function (/* arguments */) {
      const payload = getPayload.apply(null, arguments)

      return { type, payload }
    }
  } else {
    const { payload: getPayload, meta: getMeta } = initializer as { payload?: Function, meta?: Function }

    ret = function (/* arguments */) {
      const msg: any = { type: type }

      if (getPayload) {
        msg.payload = getPayload.apply(null, arguments)
      }

      if (getMeta) {
        msg.meta = getMeta.apply(null, arguments)
      }

      return msg
    }
  }

  Object.defineProperty(ret, 'type', {
    value: type
  })

  return ret
}
