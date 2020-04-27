type Func<A extends any[], R> = (...args: A) => R

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]: MessageInitializer<any[]>
}

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

type GroupMessageCreatorType<G extends string, K /* extends string */, I extends MessageInitializer<any[]>> = // TODO
  I extends Func<infer A, infer P>
    ? { (...args: A): { type: string, payload: P }, type: string, group: G, kind: K }
    : I extends { payload: Func<infer A, infer P>, meta: Func<infer A, infer M> }
      ? { (...args: A): { type: string, payload: P, meta: M }, type: string, group: G, kind: K }
      : I extends { payload: Func<infer A, infer P> }
        ? { (...args: A): { type: string, payload: P }, type: string, group: G, kind: K }
        : I extends { meta: Func<infer A, infer M> }
          ? { (...args: A): { type: string, meta: M }, type: string, group: G, kind: K }
          : { (): { type: string }, type: string }

function defineMessages<C extends MessagesConfig>(config: C):
  { [T in keyof C]: MessageCreatorType<T, C[T]> }

function defineMessages<G extends string, C extends MessagesConfig>(group: G, config: C):
  { [K in keyof C]: GroupMessageCreatorType<G, K, C[K]> }

function defineMessages(/* arguments */) {
  const
    config = arguments.length === 1 ? arguments[0] : arguments[1],
    group = arguments.length === 1 ? null : arguments[0],
    ret: any = {},
    keys = Object.keys(config)

  for (let i = 0; i < keys.length; ++i) {
    const
      key = keys[i],
      type = group ? `${group}.${key}` : key,
      kind = group ? key : null,
      initializer = config[key]

    if (typeof  initializer === 'function') {
      const getPayload = initializer as Func<any, any>
      
      ret[key] = function (/* arguments */) {
        const payload = getPayload.apply(null, arguments as any)

        return group ? {type, group, kind, payload } : { type, payload }
      }
    } else {
      const { payload: getPayload, meta: getMeta } = initializer

      ret[key] = function (/* arguments */) {
        const msg: any = { type }
        
        if (group) {
          msg.group = group
          msg.kind = kind
        }

        if (getPayload) {
          msg.payload = getPayload.apply(null, arguments as any)
        }

        if (getMeta) {
          msg.meta = getMeta.apply(null, arguments as any)
        }

        return msg
      }
    }

    Object.defineProperty(ret[key], 'type', {
      value: type
    })

    if (group) {
      Object.defineProperty(ret[key], 'group', {
        value: group
      })

      Object.defineProperty(ret[key], 'key', {
        value: key
      })
    }
  }

  return ret
}

export default defineMessages
