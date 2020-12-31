# js-messages

A small library to handle messages, message types and message creators
(also known as "actions", "action types" and "action creators" in redux context).
js-messages is written in TypeScript, everything is completely type safe.

[![Licence](https://img.shields.io/badge/licence-LGPLv3-blue.svg?style=flat)](https://github.com/js-works/js-messages/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/js-messages.svg?style=flat)](https://www.npmjs.com/package/js-messages)
[![Build status](https://travis-ci.com/js-works/js-messages.svg)](https://travis-ci.org/js-works/js-messages)
[![Coverage status](https://coveralls.io/repos/github/js-works/js-messages/badge.svg?branch=master)](https://coveralls.io/github/js-works/js-messages?branch=master)

## Installation

npm install --save js-messages

## Usage

js-messages consists of three functions:

- `defineMessage`: To define one type of message / to create one message creator
- `defineMessages`: To define multiple related messages represented by message creators
- `props`: A helper function to define a message creator where all message properties
  must be declared explicitly in an object.

Example 1 (using `defineMessage`)

```ts
import { defineMessage } from 'js-messages'

const increment = defineMessage('increment')
// for messages of shape { type: 'increment' }

const decrement = defineMessage('decrement')
// for messages of shape { type: 'decrement' }

const resetTo = defineMessage('resetTo', (value: number) => ({ value }))
// for messages of shape { type: 'resetTo', value: number }
```

Example 2 (using `defineMessage` and `props`)

```ts
const saveToStorage = defineMessage(
  'saveToStorage',
  props<{ tasks: Task[]; storageKey: string }>()
)

// for messages of shape
//   {
//     type: 'saveToStorage',
//     tasks: Task[],
//     storageKey: string
//   }
```

Example 3 (using `defineMessages`, without namespace):

```ts
import { defineMessages } from 'js-messages'

const Actions = defineMessages({
  increment: null,
  // for messages of shape { type: 'increment' }

  decrement: null,
  // for messages of shape { type: 'decrement' }

  resetTo: (value: number) => ({ value })
  // for messages of shape { type: 'resetTo', value: number }

  log: (value: number, message: string = null) => ({ value, message })
  // for messages of shape { type: 'log', value: number, message: string }
})
```

Example 4 (using `defineMessages`, with namespace):

```ts
import { defineMessages } from 'js-messages'

const Actions = defineMessages('counter', {
  increment: null,
  // for messages of shape { type: 'counter.increment' }

  decrement: null,
  // for messages of shape { type: 'counter.decrement' }

  resetTo: (value: number) => ({ value })
  // for messages of shape { type: 'counter.resetTo', value: number }

  log: (value: number, message: string = null) => ({ value, message })
  // for messages of shape { type: 'counter.log', value: number, message: string }
})
```

## License

"js-messages" is licensed under LGPLv3.

## Project status

"js-messages" is currently in beta status.
