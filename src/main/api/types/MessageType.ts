import MessageCreator from '../../internal/types/MessageCreator'

type MessageType<X> = X extends MessageCreator
  ? ReturnType<X>
  : X extends { [k: string]: MessageCreator }
  ? { [K in keyof X]: ReturnType<X[K]> }[keyof X]
  : never

export default MessageType
