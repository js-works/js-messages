import MessageCreator from '../../internal/types/MessageCreator'

type MessageType<X> = X extends MessageCreator<any, any, any>
  ? ReturnType<X>
  : X extends { [k: string]: MessageCreator<any, any, any> }
  ? { [K in keyof X]: ReturnType<X[K]> }[keyof X]
  : never

export default MessageType
