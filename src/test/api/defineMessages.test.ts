import { describe, it } from 'mocha'
import { expect } from 'chai'

import defineMessages from '../../main/api/defineMessages'

const Actions = defineMessages({
  action1: {},
  action2: (value = 0) => value,
  
  action3: {
    payload: (value: number = 21) => ({ value })
  },

  action4: {
    payload: (value: number = 42) => ({ value }),
    meta: (value: number = 42) => ({ half: value / 2})
  }
})

describe('defineMessages', () => {
  it('should create messages with neigther payload nor meta', () => {
    expect(Actions.action1())
      .to.eql({ type: 'action1' })
  })

  it('should create messages properly with payload getter', () => {
    expect(Actions.action2())
      .to.eql({ type: 'action2', payload: 0 })

    expect(Actions.action2(2))
      .to.eql({ type: 'action2', payload: 2 })
   
    expect(Actions.action3())
      .to.eql({ type: 'action3', payload: { value: 21 } })

    expect(Actions.action3(2))
      .to.eql({ type: 'action3', payload: { value: 2 } })
   
    expect(Actions.action4())
      .to.eql({ type: 'action4', payload: { value: 42 }, meta: { half: 21 } })

    expect(Actions.action4(2))
      .to.eql({ type: 'action4', payload: { value: 2 }, meta: { half: 1 } })
  }),
  
  it('should handle prefixes properly', () => {
    const UserActions = defineMessages('users', {
      addUser: (firstName: string, lastName: string) =>
        ({ firstName, lastName })
    })

    expect(UserActions.addUser('Jane', 'Doe'))
        .to.eql({ type: 'users/addUser', payload: { firstName: 'Jane', lastName: 'Doe' } })

    expect(UserActions.addUser.type)
        .to.eql('users/addUser')
  })
})

