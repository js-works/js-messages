type Func<A extends any[], R> = (...args: A) => R

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]:
    Func<any, any>
      | { payload?: Func<any, any>, meta?: Func<any, any> } 
}

type MessageCreatorType<T, X> =
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
    types = Object.keys(config)

  for (let i = 0; i < types.length; ++i) {
    const
      type = types[i],
      initializer = config[type]

    if (typeof  initializer === 'function') {
      const getPayload = initializer as Func<any, any>
      
      ret[type] = function (/* arguments */) {
        const payload = getPayload.apply(null, arguments as any)

        return { type, payload }
      }
    } else {
      const { payload: getPayload, meta: getMeta } =
        initializer as { payload?: Func<any, any>, meta?: Func<any, any> }

      ret[type] = function (/* arguments */) {
        const msg: any = { type: type }

        if (getPayload) {
          msg.payload = getPayload.apply(null, arguments as any)
        }

        if (getMeta) {
          msg.meta = getMeta.apply(null, arguments as any)
        }

        return msg
      }
    }

    Object.defineProperty(ret[type], 'type', {
      value: type
    })
  }

  return ret
}

export default defineMessages
