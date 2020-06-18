import defineMessage from './defineMessage'
import Message from '../internal/types/Message'
import Props from '../internal/types/Props'
import MessageCreator from '../internal/types/MessageCreator'

type MessagesConfig = {
  [type: string]: null | ((...args: any[]) => Props)
}

type MessageCreatorsOf<C extends MessagesConfig> = {
  [T in keyof C]: T extends string
    ? C[T] extends (...args: infer A) => infer P
      ? MessageCreator<T, A, P>
      : MessageCreator<T>
    : never
}

function defineMessages<T extends string, C extends MessagesConfig>(
  config: C
): MessageCreatorsOf<C> {
  const ret: any = {}
  const keys = Object.keys(config)

  keys.forEach((key) => {
    let type = key
    let initializer: any = config[key]

    if (
      initializer &&
      typeof initializer === 'object' &&
      typeof initializer.type === 'string'
    ) {
      type = initializer.type
      initializer = { ...initializer }
      delete initializer.type
    }

    ret[key] = defineMessage(type, initializer)
  })

  return ret
}

export default defineMessages
