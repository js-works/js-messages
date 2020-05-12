import { pseudoRandomBytes } from "crypto"

export default update


function update<S extends State>(state: S, getUpdates: (createPath: Path<S>) => Update<S, any>[]): S
function update<S extends State>(state: S): CreatePath<S>

function update<S extends State>(state: S, arg2?: any): any {
  let ret: any
  
  if (!arg2) {
    ret = createPath(state)
  } else {
    const
      createPath = (...path: string[]) => new XXX(state, path),
      updates = arg2(createPath as any) // TODO

    return performUpdates(state, updates.map((update: any) => { // TODO
      return { path: update._path, mapper: update._mapper }
    }))
  }

  return ret
}

type CreatePath<S extends State> = {
  <K1 extends keyof S>(k1: K1): Cursor<S, S[K1]>,
  <K1 extends keyof S, K2 extends keyof S[K1]>(k1: K1, k2: K2): Cursor<S, S[K1][K2]>,
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(k1: K1, k2: K2, k3: K3): Cursor<S, S[K1][K2][K3]>,
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): Cursor<S, S[K1][K2][K3][K4]>,
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Cursor<S, S[K1][K2][K3][K4][K5]>,
}

function createPath<S extends State>(state: S) {
  function path<K1 extends keyof S>(k1: K1): Cursor<S, S[K1]>
  function path<K1 extends keyof S, K2 extends keyof S[K1]>(k1: K1, k2: K2): Cursor<S, S[K1][K2]>
  function path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(k1: K1, k2: K2, k3: K3): Cursor<S, S[K1][K2][K3]>
  function path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): Cursor<S, S[K1][K2][K3][K4]>
  function path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Cursor<S, S[K1][K2][K3][K4][K5]>
  function path(...args: any[]): Cursor<S, any> {
    return new Cursor(state, args)
  }

  return path
}

class XXX<S extends State, T> {
  private _state: S
  private _path: string[]

  constructor(state: S, path: string[]) {
    this._state = state
    this._path = path
  }

  map(mapper: (value: T) => T): S {
    return new Update(this._path, mapper) as any // TODO
  }

  set(newValue: T) {
    return new Update(this._path, () => newValue) as any // TODO
  }
}


class Update<S extends State, T> {
  _path: string[]
  _mapper: (value: T) => T

  constructor(path: string[], mapper: (value: T) => T) {
    this._path = path
    this._mapper = mapper
  }

  perform(state: S) {
    return performUpdate(state, this._path, this._mapper)
  }
}

class Cursor<S extends State, T> {
  _state: S
  _path: string[]

  constructor(state: S, path: string[]) {
    this._state = state
    this._path = path
  }

  map(mapper: (value: T) => T): S {
    return performUpdate(this._state, this._path, mapper) 
  }

  set(newValue: T) {
    return performUpdate(this._state, this._path, () => newValue) 
  }
}

type Path<S extends State> = {
  <K1 extends keyof S>(k1:  K1): Cursor<S, S[K1]>
  <K1 extends keyof S, K2 extends keyof S[K1]>(k1: K1, k2: K2): Cursor<S, S[K1][K2]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(k1: K1, k2: K2, k3: K3): Cursor<S, S[K1][K2][K3]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): Cursor<S, S[K1][K2][K3][K4]>
  <K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Cursor<S, S[K1][K2][K3][K4][K5]>
}

function performUpdates<S extends State>(state: S, updates: { path: string[], mapper: (value: any) => any }[]) {
  let state2 = { ...state }
  let modifiedPaths: any = updates.length > 1 ? {} : null // TODO

  updates.forEach(({ path, mapper }) => {
    let pathAsString = ''
    let substate = state2 // TODO - do we really need variable substate?
    let substate2: any = state2

    path.forEach((key, idx) => {
      pathAsString = idx === 0 ? key : '@' + key

      if (idx < path.length - 1) {
        if (!modifiedPaths || !hasOwnProp(modifiedPaths, pathAsString)) {
          substate2[key] = { ...substate[key] }
          
          if (modifiedPaths) {
            modifiedPaths[pathAsString] = true
          }
        }

        substate = substate[key]
        substate2 = substate2[key]
      } else {
        substate2[key] = mapper(substate2[key])
      }
    })
  })

  return state2
}

function performUpdate<S extends State>(state: S, path: string[], mapper: (value: any) => any): S {
  return performUpdates(state, [{ path, mapper }])
}

function hasOwnProp(obj: any, propName: string) {
  return Object.prototype.hasOwnProperty.call(obj, propName)
}

type State = Record<string, any>
