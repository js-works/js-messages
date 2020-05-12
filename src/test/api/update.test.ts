import { describe, it } from 'mocha'
import { expect } from 'chai'

import update from '../../main/api/update'

const state = {
  login: {
    username: 'Jane Doe',
    isAdmin: true
  },

  tasks: [
    { id: 1, text: 'Do something' },
    { id: 2, text: 'Do something else' },
  ]
}

const
  login = state.login,
  username = login.username,
  tasks = state.tasks,
  task1 = tasks[0],
  task2 = tasks[1]

describe('update', () => {
  it('should perform a "set" operation properly on objects', () => {
    const result = update(state).path('login', 'isAdmin').set(false)
    
    expect(result)
      .to.eql({
        ...state,
        login: {
          ...state.login,
          isAdmin: false
        }
      })
  })
  
  it('should perform a "map" operation properly on objects', () => {
    const result = update(state).path('login', 'isAdmin').map(it => !it)
    
    expect(result)
      .to.eql({
        ...state,
        login: {
          ...state.login,
          isAdmin: false
        }
      })
  })
  
  it('should perform multiple updates properly', () => {
    const result = update(state).modify(path => [
       path('login', 'username').set('John Doe') as any, // TODO
       path('login', 'isAdmin').map(it => !it) as any, // TODO
    ])
    
    expect(result)
      .to.eql({
        ...state,
        login: {
          ...state.login,
          username: 'John Doe',
          isAdmin: false
        }
      })
  })
})
