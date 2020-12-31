// === exports ======================================================

export { defineMessage, defineMessages, props }

// === types ========================================================

type Obj = Record<any, any>

type Func<A extends any[] = any, R = any> = (...args: A) => R

type Props = Record<string, any> & { type?: never }

type Message<T extends string = string, P extends Props = {}> = { type: T } & P

type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>
  type: T
}

type MessagesConfig = {
  [type: string]: null | Func<any, Props>
}

type MessageCreators<C extends MessagesConfig, N extends string> = {
  [T in keyof C]: T extends string
    ? C[T] extends null
      ? MessageCreator<N extends '' ? T : `${N}.${T}`, [], {}>
      : C[T] extends Func<infer A, infer P>
      ? MessageCreator<N extends '' ? T : `${N}.${T}`, A, P>
      : never
    : never
}

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
      return merge({ type }, getProps.apply(null, arguments as any))
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
  const category = arg2 ? arg1 : ''
  const config = arg2 ? arg2 : arg1
  const keys = Object.keys(config)

  keys.forEach((key) => {
    let type = key
    let initializer: any = config[key]

    ret[key] = defineMessage(
      category ? `${category}.${type}` : type,
      initializer
    )
  })

  return ret
}

// === props =========================================================

function props<P extends Props>(): (props: P) => P {
  return (props) => props
}

// === utils =========================================================

function merge(target: Obj, source: Obj): Obj {
  // Note: Object.assign is not available everywhere
  for (let propName in source) {
    /* istanbul ignore else */
    if (source.hasOwnProperty(propName)) {
      target[propName] = source[propName]
    }
  }

  return target
}
