import Message from './Message'
import Props from './Props'

type MessageCreator<
  T extends string,
  A extends any[] = [],
  P extends Props = {}
> = {
  (...args: A): Message<T, P>
  type: T
}

export default MessageCreator
