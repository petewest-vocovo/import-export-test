import * as assert from 'assert'

// Named imports are not supported in JS when importing CommonJS modules _if_
// they reassign the `module.exports` object: "SyntaxError: Named export 'bar' not found."
// import { foo, bar } from './b.js'

// The default import gets the `module.exports` object
import wholeModule from './b.js'

// This imports a "Module" object which includes a `"default"` property containing `module.exports` but
// does _not_ include the named exports for the same reason that we can't import named exports
import * as wrappedModule from './b.js'

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
})
// Shallow clone here because `wrappedModule` is a Module object which we can't generate for testing
assert.deepStrictEqual({ ...wrappedModule }, {
  default: {
    foo: 1,
    bar: 2,
  }
})
