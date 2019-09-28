type MessageCreator<A extends any[], P, M> = {
  readonly type: string,
  
  (...args: A): {
    type: string,
    payload?: P,
    meta?: M
  }
}

export default MessageCreator
