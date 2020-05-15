import defineMessage from './defineMessage'
import Func from '../internal/types/Func'
import MessageCreatorType from '../internal/types/MessageCreatorType'

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { type?: string, payload?: Func<A, any>, meta?:Func<A, any> }

type MessageInitializer2<A extends any[]> =
  Func<A, any>
    | { type?: never, payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]: MessageInitializer<any[]>
}

type MessagesConfig2 = {
  [type: string]: MessageInitializer2<any[]>
}

function defineMessages<C extends MessagesConfig>(config: C): {
  [K in keyof C]:
    C[K] extends { type: infer T }
      ? MessageCreatorType<T, Omit<C[K], 'type'>>
      : MessageCreatorType<K, C[K]>
}

function defineMessages<C extends MessagesConfig2>(catgory: string, config: C): {
  [K in keyof C]: MessageCreatorType<string, C[K]>
}

function defineMessages(arg1: any, arg2?: any) {
  const
    config = typeof arg1 !== 'string' ? arg1 : arg2,
    category = typeof arg1 === 'string' ? arg1 : null,
    ret: any = {},
    keys = Object.keys(config)

  keys.forEach(key => {
    let
      type = category ? `${category}.${key}` : key,
      initializer: any = config[key]

    if (initializer && typeof initializer === 'object' && typeof initializer.type === 'string') {
      type = initializer.type
      initializer = { ...initializer }
      delete initializer.type
    }

    ret[key] = defineMessage(type, initializer)
  })

  return ret
}

export default defineMessages
