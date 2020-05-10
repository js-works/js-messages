import State from '../internal/types/State'
import Reducer from '../internal/types/Reducer'
import Message from '../internal/types/Message'

type Reducers = {
  [key: string]: Reducer<any>
}

type CombinedState<R extends Reducers> = {
  [K in keyof R]: R[K] extends Reducer<infer S> ? S : never
}

type CombinedReducers<R extends Reducers> = Reducer<CombinedState<R>>

export default function combineReducers<R extends Reducers>(reducers: R): CombinedReducers<R> {
  const keys: (keyof R)[] = Object.keys(reducers)

  return (state: CombinedState<R> | undefined, msg: Message) => {
    let newState: CombinedState<R> | null = null

    keys.forEach(key => {
      const
        subState = state ? state[key] : undefined,
        newSubState = reducers[key](subState, msg)

      if (newSubState && newSubState !== subState) {
        if (!newState) {
          newState = Object.assign({}, state)
        }

        newState[key] = newSubState
      }
    })

    return newState! || state
  }
}
