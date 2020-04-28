type MessageOf<T> =
  T extends { [k: string]: (...args: any[]) => infer R }
    ? { [K in keyof T]: R  }[keyof T]
    : never

export default MessageOf
