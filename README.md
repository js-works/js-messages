# js-messages

A small library to handle messages, message types and message factories
(also known as "actions", "action types" and "action creators" in redux context).
js-messages is written in TypeScript, everything is completely type safe.

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-messages/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-messages.svg?style=flat)](https://www.npmjs.com/package/js-messages)
[![Build status](https://travis-ci.com/js-works/js-messages.svg)](https://travis-ci.org/js-works/js-messages)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-messages/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-messages?branch=master)

## Installation

npm install --save js-messages

## Usage

Example 1:

```javascript
import defineMessages from 'js-messages'

const Actions = defineMessages({
  increment: {},
  // for messages of shape { type: 'increment' }

  decrement: {}
  // for messages of shape { type: 'decrement' }

  resetTo: (value: number) => value
  // for messages of shape { type: 'resetTo', payload: number }
  
  log: (value: number, message: string = null) => ({ value, message })
  // for messages of shape { type: 'log', payload: { value: number, message: string } }
})

expect(Actions.increment())
  .to.eql({ type: 'increment' })

expect(Actions.decrement())
  .to.eql({ type: 'decrement' })

expect(Actions.resetTo(0))
  .to.eql({ type: 'resetTo', payload: 0 })

expect(Actions.log(42, 'value at 2019-03-08 T 10:45 UTC'))
  .to.eql({
     type: 'log',
     
     payload: {
       value: 42,
       message: 'value at 2019 T 10:45 UTC'
     }
  })

expect(Actions.increment.type).to.eql('increment')
expect(Actions.decrement.type).to.eql('decrement')
expect(Actions.resetType.type).to.eql('resetTo')
expect(Actions.log.type).to.eql('log')
```

Example 2:

```javascript
import defineMessages from 'js-messages'

type Task = {
  id: number,
  title: string,
  description: string,
  completed: boolean
}

const Actions = defineMessages({
  addTask: (title: string, description: string = '') => ({ title, description }),
  // for messages of shape { type: 'addTask', payload: { title: string, description: string }}

  completeTask: (id: number) => id,
  // for messages of shape { type: 'completeTask', payload: number }

  saveToLocalStore: {
    payload: (tasks: Task[], key: string, user: string) => tasks,
    meta: (tasks: Task[], key: string, user: string) => ({ key, user })
  }
  // for messages of shape
  //   {
  //     type: 'saveToLocalStore',
  //     payload: Task[],
  //     meta: { key: string, user: string }
  //   }
})
```
## License

"js-messages" is licensed under LGPLv3.

## Project status

"js-messages" is currently in alpha status.
