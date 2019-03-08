import MessageInitializer from '../../internal/types/MessageInitializer'

type MessagesConfig = {
  [name: string]: MessageInitializer<any>
}

export default MessagesConfig