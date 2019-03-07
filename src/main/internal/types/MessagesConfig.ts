type PayloadCreator = (...args: any) => any
type MetaCreator = (...args: any) => any
type Validator = (...args: any) => true | false | null | Error

type MessagesConfig = {
  [name: string]:
    PayloadCreator
      | { payload?: PayloadCreator, meta?: MetaCreator, validator?: Validator }
}

export default MessagesConfig