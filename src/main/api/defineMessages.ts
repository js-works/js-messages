import defineMessage from './defineMessage'
import Func from '../internal/Func'
import MessageCreatorType from '../internal/MessageCreatorType'

type MessageInitializer1<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig1 = {
  [type: string]: MessageInitializer1<any[]>
}

type MessageInitializer2<T extends string, A extends any[]> =
    { type: T, payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig2 = {
  [key: string]: MessageInitializer2<string, any>
}

function defineMessages<C extends MessagesConfig1>(config: C):
  { [T in keyof C]: MessageCreatorType<T, C[T]> }

function defineMessages<C extends MessagesConfig2>(config: C):
  { [K in keyof C]: MessageCreatorType<C[K]['type'], Omit<C[K], 'type'>> }

function defineMessages<C extends MessagesConfig1>(config: C):
  { [key: string]: MessageCreatorType<string, any> } {

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
