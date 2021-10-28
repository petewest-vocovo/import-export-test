import * as assert from 'assert'

import { foo, bar } from './b.js'
import wholeModule from './b.js'
import * as wrappedModule from './b.js'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
// Shallow clone here because `wrappedModule` is a Module object which we can't generate for testing
assert.deepStrictEqual({ ...wrappedModule }, {
  __esModule: true,
  foo: 1,
  bar: 2,
  default: {
    foo: 1,
    bar: 2,
    default: { zim: 3 }
  },
})
