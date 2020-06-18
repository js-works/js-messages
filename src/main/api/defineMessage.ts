import Message from '../internal/types/Message'
import Props from '../internal/types/Props'

function defineMessage<T extends string>(type: T): () => Message<T>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps: (...args: A) => P
): (...args: A) => Message<T, P>

function defineMessage(
  type: string,
  getProps?: (...args: any[]) => Record<string, any>
) {
  let ret: Record<string, any>

  if (!getProps) {
    const msg = Object.freeze({ type })

    ret = () => msg
  } else {
    ret = (...args: any[]) =>
      Object.assign({ type }, getProps.apply(null, args))
  }

  Object.defineProperty(ret, 'type', {
    value: type
  })

  return ret
}

export default defineMessage
