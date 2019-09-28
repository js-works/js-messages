import buildMessageCreator from '../internal/buildMessageCreator'

// --- defineMessage ------------------------------------------------

function defineMessage(
  type: string
): () => { type: string }

function defineMessage<A extends any[], P>(
  type: string,
  getPayload: (...args: A) => P
): (...args: A) => { type: string, payload: P }

function defineMessage<A extends any[], P>(
  type: string,

  init: {
    payload: (...args: A) => P,
    validate?: (...args: A) => boolean | null | Error
  }
): (...args: A) => { type: string, payload: P } 

function defineMessage<A extends any[], M>(
  type: string,
  
  init: {
    meta: (...args: A) => M,
    validate?: (...args: A) => boolean | null | Error
  }
): (...args: A) => { type: string, meta: M} 

function defineMessage<A extends any[], P, M>(
  type: string,
  
  init: {
    payload: (...args: A) => P,
    meta: (...args: A) => M,
    validate?: (...args: A) => boolean | null | Error
  }
): (...args: A) => { type: string, payload: P, meta: M }

function defineMessage(
  type: string,
  init: any = null
): any {
  return buildMessageCreator(type, init)
}

// --- exports ------------------------------------------------------

export default defineMessage
