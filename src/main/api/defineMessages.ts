import Signature from '../internal/types/Signature'
import MessagesConfig from '../internal/types/MessagesConfig'
import MessageInitializer from '../internal/types/MessageInitializer'
import MessageCreator from '../internal/types/MessageCreator'
import buildMessageCreator from '../internal/buildMessageCreator';

// --- defineMessages -----------------------------------------------

function defineMessages<T extends MessagesConfig>(prefix: string, config: T):
  { [K in keyof T]: MessageCreator<K, Arguments<any, T[K]>, Payload<T[K]>, Meta<T[K]>> }

function defineMessages<T extends MessagesConfig>(config: T):
  { [K in keyof T]: MessageCreator<K, Arguments<any, T[K]>, Payload<T[K]>, Meta<T[K]>> }


function defineMessages(arg1: any, arg2?: any): any {
  const
    ret: any = {},
    prefix: string = typeof arg1 === 'string' ? arg1 : '',
    config: any = typeof arg1 === 'string' ? arg2 : arg1,
    keys = Object.keys(config)

  for (let i = 0; i < keys.length; ++i) {
    const
      key = keys[i],
      type = !prefix ? key : `${prefix}/${key}`

    ret[key] = buildMessageCreator(type, config[key])
  }

  return ret
}

// --- locals -------------------------------------------------------

type Func<A extends any[], R> = (...args: A) => R

type Arguments<A extends any[], I extends MessageInitializer<any>>
  = I extends Func<A, any>
    ? Signature<I>
    : (I extends { payload: Func<A, any> }
      ? Signature<I['payload']>
      : []) 

type Payload<I extends MessageInitializer<any>>
  = I extends Func<any, any>
    ? ReturnType<I> 
    : (I extends { payload: Func<any, any> }
      ? ReturnType<I['payload']>
      : any) 

type Meta<I extends MessageInitializer<any>>
  = I extends Func<any, any>
    ? ReturnType<I> 
    : (I extends { meta: Func<any, any> }
      ? ReturnType<I['meta']>
      : any) 

// --- exports ------------------------------------------------------

export default defineMessages
