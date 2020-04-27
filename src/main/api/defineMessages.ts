type Func<A extends any[], R> = (...args: A) => R

type MessageCreator<T extends string, P, M, A extends any[]> = {
  readonly type: T,
  
  (...args: A): {
    readonly type: T,
    readonly payload?: P,
    readonly meta?: M
  }
}

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]:
    Func<any, any>
      | { payload?: Func<any, any>, meta?: Func<any, any> } 
}

type MessageCreatorType<T /* extends string */, X extends MessageInitializer<any>> =
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

function buildMessageCreator<T extends string, A extends any[]>
  (type: T, initializer: MessageInitializer<A> | null = null): MessageCreator<T, any, any, A> {
  
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

export default defineMessages
