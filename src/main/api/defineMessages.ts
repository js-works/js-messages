import defineMessage from './defineMessage'
import Func from '../internal/Func'
import MessageCreatorType from '../internal/MessageCreatorType'

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

type MessagesConfig = {
  [type: string]: MessageInitializer<any[]>
}

function defineMessages<C extends MessagesConfig>(config: C):
  { [T in keyof C]: MessageCreatorType<T, C[T]> } {

  const
    ret: any = {},
    types = Object.keys(config)

  for (let i = 0; i < types.length; ++i) {
    const
      type = types[i],
      initializer = config[type]
    
    ret[type] = defineMessage(type, initializer)
  }

  return ret
}

export default defineMessages
