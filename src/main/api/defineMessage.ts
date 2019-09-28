import buildMessageCreator from '../internal/buildMessageCreator'
import MessageInitializer from '../internal/types/MessageInitializer'
import MessageCreator from '../internal/types/MessageCreator'

export default function defineMessage<K extends String, A extends any[]>
  (type: string, initializer: MessageInitializer<A> = null): MessageCreator<A, any, any> {

  return buildMessageCreator(type, initializer)
}
