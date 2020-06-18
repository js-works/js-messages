import { describe, it } from 'mocha'
import { expect } from 'chai'

import { defineMessage, props } from '../../main/index'

const action = defineMessage('someAction', props<{ a: number; b: string }>())

describe('props', () => {
  it('should define messages using the `props` function properly', () => {
    expect(action({ a: 123, b: 'some text' })).to.eql({
      type: 'someAction',
      a: 123,
      b: 'some text'
    })
  })
})
