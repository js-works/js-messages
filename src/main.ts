// === exports ======================================================

export { defineMessage, defineMessages, props, MessageOf }

// === types ========================================================

// generic type alias for functions
type Func<A extends any[] = any, R = any> = (...args: A) => R

// type for properties object, not allowing a property called "type"
type Props = Record<string, any> & { type?: undefined }

// generic type for messages
type Message<T extends string = string, P extends Props = {}> = { type: T } & P

// generic type for message factory function (aka "action creator" in Redux)
type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>
  type: T
}

// type for configuration object of messages
type MessagesConfig = {
  [type: string]: null | Func<any, Props>
}

// utility type that derives the message creator types of a
// messages configuration object
type MessageCreators<C extends MessagesConfig, N extends string> = {
  [T in keyof C]: T extends string
    ? C[T] extends null
      ? MessageCreator<N extends '' ? T : `${N}.${T}`, [], {}>
      : C[T] extends Func<infer A, infer P>
      ? MessageCreator<N extends '' ? T : `${N}.${T}`, A, P>
      : never
    : never
}

// utility type to derive the message type of a message creator
// or the combined type of all possible messages of a message
// creator object
type MessageOf<X> = X extends MessageCreator<any, any, any>
  ? ReturnType<X>
  : X extends { [k: string]: MessageCreator<any, any, any> }
  ? { [K in keyof X]: ReturnType<X[K]> }[keyof X]
  : never

// === defineMessage ================================================

function defineMessage<T extends string>(type: T): MessageCreator<T>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps: (...args: A) => P
): MessageCreator<T, A, P>

function defineMessage(type: string, getProps?: Func): any {
  let ret: Func

  if (!getProps) {
    const msg = Object.freeze({ type })

    ret = () => msg
  } else {
    // this form will be a bit shorter when transpiled to ES5
    ret = function (/* arguments */) {
      const msg: Message<string, any> = { type }
      const props = getProps.apply(null, arguments as any)

      // Object.assign is not available everywhere
      for (const propName in props) {
        /* istanbul ignore else */
        if (propName !== 'type' && props.hasOwnProperty(propName)) {
          msg[propName] = props[propName]
        }
      }

      return msg
    }
  }

  Object.defineProperty(ret, 'type', {
    value: type
  })

  return ret
}

// === defineMessages ================================================

function defineMessages<C extends MessagesConfig>(
  config: C
): MessageCreators<C, ''>

function defineMessages<C extends MessagesConfig, N extends string>(
  namespace: N,
  config: C
): MessageCreators<C, N>

function defineMessages(arg1: any, arg2?: any): any {
  const ret: any = {}
  const namespace = arg2 ? arg1 : ''
  const config = arg2 ? arg2 : arg1

  // Object.keys and Array.protype.forEach are not available everywhere
  for (const key in config) {
    /* istanbul ignore else */
    if (config.hasOwnProperty(key)) {
      let type = key
      let initializer: any = config[key]

      ret[key] = defineMessage(
        namespace ? `${namespace}.${type}` : type,
        initializer
      )
    }
  }

  return ret
}

// === props =========================================================

function props<P extends Props>(): (props: P) => P {
  return (props) => props
}
