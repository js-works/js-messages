import buildMessageCreator from '../internal/buildMessageCreator';

// --- defineMessages -----------------------------------------------

function defineMessages<T extends MessagesConfig>(prefix: string, config: T):
  { [K in keyof T]: MessageCreatorOf<T[K]> & { type: string }}

function defineMessages<T extends MessagesConfig>(config: T):
  { [K in keyof T]: MessageCreatorOf<T[K]> & { type: string } }

function defineMessages(arg1: any, arg2?: any): any {
  const
    ret: any = {},
    prefix: string = typeof arg1 === 'string' ? arg1 : '',
    config: any = typeof arg1 === 'string' ? arg2 : arg1,
    keys = Object.keys(config)

  for (let i = 0; i < keys.length; ++i) {
    const
      key = keys[i],
      type = !prefix ? key : `${prefix}/${key}`

    ret[key] = buildMessageCreator(type, config[key])
  }

  return ret
}

// --- locals -------------------------------------------------------

type MessagesConfig = {
  [name: string]: MessageInitializer<any>
}

type MessageInitializer<A extends any[]> =
  {
    payload?: (...args: A) => any,
    meta?: (...args: A) => any,
    validate?: (args: A) => any
  } | ((...args: A) => any)

type MessageCreatorOf<T> =
  T extends {
      payload: (...args: infer A) => infer P,
      meta: (...args: infer A) => infer M,
      validate?: (...args: infer A) => boolean | null | Error
    }
  ? (...args: A) => { type: string, payload: P, meta: M}
  : T extends {
      meta: (...args: infer A) => infer M,
      validate?: (...args: infer A) => boolean | null | Error
    }
  ? (...args: A) => { type: string, meta: M}
  : T extends {
    payload: (...args: infer A) => infer P,
    validate?: (...args: infer A) => boolean | null | Error
  } 
  ? (...args: A) => { type: string, payload: P }
  : T extends (...args: infer A) => infer P
  ? (...args: A) => { type: string, payload: P }
  : T extends {}
  ? () => { type: string}
  : never

// --- exports ------------------------------------------------------

export default defineMessages
