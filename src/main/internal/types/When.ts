import State from './State'
import Message from './Message'

type When<S extends State> = {
  type: string,
  handle: (state: S, msg: Message) => Partial<S> | void
}

export default When
