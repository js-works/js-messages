import Message from '../internal/types/Message'
import Props from '../internal/types/Props'
import MessageCreator from '../internal/types/MessageCreator'

function defineMessage<T extends string>(type: T): MessageCreator<T>

function defineMessage<T extends string, A extends any[], P extends Props>(
  type: T,
  getProps: (...args: A) => P
): MessageCreator<T, A, P>

function defineMessage(
  type: string,
  getProps?: (...args: any[]) => Record<string, any>
): MessageCreator<any, any, any> {
  let ret: any

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
