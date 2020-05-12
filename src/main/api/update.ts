export default function update<S extends State>(state: S): Updater<S> {
  return new Updater(state)
}

class Updater<S extends State> {
  private _state: S

  constructor(state: S) {
    this._state = state
  }

  path<K1 extends keyof S>(k1: K1): Cursor<S, S[K1]>
  path<K1 extends keyof S, K2 extends keyof S[K1]>(k1: K1, k2: K2): Cursor<S, S[K1][K2]>
  path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(k1: K1, k2: K2, k3: K3): Cursor<S, S[K1][K2][K3]>
  path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3]>(k1: K1, k2: K2, k3: K3, k4: K4): Cursor<S, S[K1][K2][K3][K4]>
  path<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2], K4 extends keyof S[K1][K2][K3], K5 extends keyof S[K1][K2][K3][K4]>(k1: K1, k2: K2, k3: K3, k4: K4, k5: K5): Cursor<S, S[K1][K2][K3][K4][K5]>
  path(...args: any[]): Cursor<S, any> {
    return new Cursor(this._state, args)
  }

  modify(getUpdates: (createPath: Path<S>) => Update<S, any>[]): S {
    const
      createPath = (...path: string[]) => new XXX(this._state, path),
      updates = getUpdates(createPath as any) // TODO

    let ret = this._state

    return performUpdates(this._state, updates.map(update => {
      return { path: update._path, mapper: update._mapper }
    }))
  }
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

  updates.forEach(({ path, mapper }) => {
    let substate = state2 // TODO - do we really need variable substate?
    let substate2: any = state2

    path.forEach((key, idx) => {
      if (idx < path.length - 1) {
        substate2[key] = { ...substate[key] }
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

type State = Record<string, any>