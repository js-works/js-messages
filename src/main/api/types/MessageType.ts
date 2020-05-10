import MessageCreatorType from '../../internal/types/MessageCreatorType'

type MessageType<X> =
  X extends MessageCreatorType<any, any>
    ? ReturnType<X>
    : X extends { [k: string]: MessageCreatorType<any, any> }
      ? { [K in keyof X]: ReturnType<X[K]> }[keyof X]
      : never


export default MessageType
