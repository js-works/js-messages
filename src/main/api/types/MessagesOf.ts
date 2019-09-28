// --- MessagesOf ---------------------------------------------------

type MessagesOf<T extends { [k: string]: MessageCreator<any, any> }> =
  { [K in keyof T]:
      T[K] extends (...args: any[]) => infer R
        ? R
        : never
  }

// --- locals -------------------------------------------------------

type MessageCreator<P, M> = (...args: any[]) => {
  type: string,
  payload?: P,
  meta?: M 
}

// --- exports ------------------------------------------------------

export default MessagesOf
