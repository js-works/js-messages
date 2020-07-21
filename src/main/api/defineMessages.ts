import defineMessage from './defineMessage'
import Message from '../internal/types/Message'
import Props from '../internal/types/Props'
import MessageCreator from '../internal/types/MessageCreator'

type MessagesConfig = {
  [type: string]: null | ((...args: any[]) => Props)
}

type MessageCreators<
  C extends MessagesConfig,
  ForceStrings extends boolean = false
> = {
  [T in keyof C]: T extends string
    ? C[T] extends (...args: infer A) => infer P
      ? MessageCreator<ForceStrings extends false ? T : string, A, P>
      : MessageCreator<ForceStrings extends false ? T : string>
    : never
}

function defineMessages<C extends MessagesConfig>(config: C): MessageCreators<C>

function defineMessages<C extends MessagesConfig>(
  namespace: string,
  config: C
): MessageCreators<C, true>

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

export default defineMessages
