import assert from 'assert'

// Named imports mapped from module.exports properties
import { foo, bar } from './b'
// This gives us the actual `module.exports` object due to the `esModuleInterop` compiler option
import wholeModule from './b'
// This gives us an object with all the named exports, and the `module.exports` object as a default export
import * as wrappedModule from './b'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
assert.deepStrictEqual(wholeModule, { foo: 1, bar: 2, default: { zim: 3 }})
assert.deepStrictEqual(wrappedModule, {
  foo: 1,
  bar: 2,
  default: { foo: 1, bar: 2, default: { zim: 3 }},
})
