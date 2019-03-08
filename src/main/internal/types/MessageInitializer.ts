type PayloadCreator<Args extends any[]> = (...args: Args) => any
type MetaCreator<Args extends any[]> = (...args: Args) => any
type Validator<Args extends any[]> = (...args: Args) => true | false | null | Error

type MessageInitializer<Args extends any[]> =
  PayloadCreator<Args>
    | { payload?: PayloadCreator<Args>, meta?: MetaCreator<Args>, validate?: Validator<Args> }

export default MessageInitializer
