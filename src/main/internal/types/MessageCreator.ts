type MessageCreator<K, A extends any[], P, M> = {
  readonly type: K,
  
  (...args: A): {
    type: K,
    payload?: P,
    meta?: M
  }
}

export default MessageCreator
