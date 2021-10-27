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
assert.deepStrictEqual(wrappedModule.default, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
