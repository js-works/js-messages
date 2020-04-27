type MessageCreator<T, P, M, A extends any[]> = {
  readonly type: T,
  
  (...args: A): {
    readonly type: T,
    readonly payload?: P,
    readonly meta?: M
  }
}

export default MessageCreator
