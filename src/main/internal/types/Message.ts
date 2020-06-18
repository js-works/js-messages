import Props from './Props'

type Message<T extends string = string, P extends Props = {}> = { type: T } & P

export default Message
