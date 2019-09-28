type MessageCreator<A extends any[], P, M> =
  A extends []
    ? {
        readonly type: string,
        (): { type: string }
      }
    : {
        readonly type: string,

        (...args: A): {
          type: string,
          payload?: P,
          meta?: M
        }
    }

export default MessageCreator
