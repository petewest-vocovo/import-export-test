import * as assert from 'assert'

// Named imports mapped from module.exports properties
import { foo, bar } from './b'
// The default import will error if no `default` property is exported in b:
// "Module '".../b"' has no default export."
import zim from './b'
// This gives us the actual module.exports object
import * as wholeModule from './b'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
assert.deepStrictEqual(zim, { zim: 3 })
assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
