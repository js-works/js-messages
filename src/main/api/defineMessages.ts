import defineMessage from './defineMessage'
import Func from '../internal/Func'
import MessageCreatorType from '../internal/MessageCreatorType'

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { type?: string, payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]: MessageInitializer<any[]>
}

function defineMessages<C extends MessagesConfig>(config: C): {
  [K in keyof C]:
    C[K] extends { type: infer T }
      ? MessageCreatorType<T, Omit<C[K], 'type'>>
      : MessageCreatorType<K, C[K]>
} {
  const
    ret: any = {},
    keys = Object.keys(config)

  keys.forEach(key => {
    let
      type =  key,
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
