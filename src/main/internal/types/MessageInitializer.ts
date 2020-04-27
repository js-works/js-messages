type PayloadCreator<P, A extends any[]> = (...args: A) => P
type MetaCreator<M, A extends any[]> = (...args: A) => M

type MessageInitializer<A extends any[]> =
  PayloadCreator<any, A>
    | { payload?: PayloadCreator<any, A>, meta?: MetaCreator<any, A> }

export default MessageInitializer
