import * as assert from 'assert'

// Exported properties on `module.exports` are available as named imports
import { foo, bar } from './b.js'

// The default import gets the `module.exports` object
import wholeModule from './b.js'

// This imports a "Module" object which includes the named exports
// as well as a `"default"` property containing `module.exports`.
import * as wrappedModule from './b.js'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
})
// Shallow clone here because `wrappedModule` is a Module object which we can't generate for testing
assert.deepStrictEqual({ ...wrappedModule }, {
  foo: 1,
  bar: 2,
  default: {
    foo: 1,
    bar: 2,
  },
})
