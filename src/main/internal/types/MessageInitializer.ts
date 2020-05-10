import Func from './Func'

type MessageInitializer<A extends any[]> =
  Func<A, any>
    | { payload?: Func<A, any>, meta?:Func<A, any> }

export default MessageInitializer
