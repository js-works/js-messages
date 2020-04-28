import Func from '../internal/Func'
import MessageInitializer from '../internal/MessageInitializer'
import MessageCreatorType from '../internal/MessageCreatorType'

function defineMessage<T extends string, I extends MessageInitializer<any[]>>(
  type: T,
  initializer?: I
): MessageCreatorType<T, I> {
  let ret: any

  if (!initializer) {
    const message = { type }

    ret = () => message
  } else if (typeof initializer === 'function') {
    const getPayload = initializer as Func<any, any>
    
    ret = function (/* arguments */) {
      const payload = getPayload.apply(null, arguments as any)

      return { type, payload }
    }
  } else {
    const { payload: getPayload, meta: getMeta } = initializer as any // TODO

    ret = function (/* arguments */) {
      const msg: any = { type }

      if (getPayload) {
        msg.payload = getPayload.apply(null, arguments as any)
      }

      if (getMeta) {
        msg.meta = getMeta.apply(null, arguments as any)
      }

      return msg
    }
  }

  Object.defineProperty(ret, 'type', {
    value: type
  })

  return ret
}

export default defineMessage
