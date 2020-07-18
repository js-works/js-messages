import defineMessage from './defineMessage'
import Message from '../internal/types/Message'
import Props from '../internal/types/Props'
import MessageCreator from '../internal/types/MessageCreator'

type MessagesConfig = {
  [type: string]: null | ((...args: any[]) => Props)
}

type MessageCreators1Of<C extends MessagesConfig> = {
  [T in keyof C]: T extends string
    ? C[T] extends (...args: infer A) => infer P
      ? MessageCreator<T, A, P>
      : MessageCreator<T>
    : never
}

type MessageCreators2Of<C extends MessagesConfig> = {
  [T in keyof C]: T extends string
    ? C[T] extends (...args: infer A) => infer P
      ? MessageCreator<string, A, P>
      : MessageCreator<string>
    : never
}

function defineMessages<C extends MessagesConfig>(
  config: C
): MessageCreators1Of<C>

function defineMessages<C extends MessagesConfig>(
  namespace: string,
  config: C
): MessageCreators2Of<C>

function defineMessages(arg1: any, arg2?: any): any {
  return arg2 ? defineMessages2(arg1, arg2) : defineMessages1(arg1)
}

function defineMessages1<C extends MessagesConfig>(
  config: C
): MessageCreators2Of<C> {
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

function defineMessages2<C extends MessagesConfig>(
  category: string,
  config: C
): MessageCreators2Of<C> {
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

    ret[key] = defineMessage(`${category}.${type}`, initializer)
  })

  return ret
}

export default defineMessages
