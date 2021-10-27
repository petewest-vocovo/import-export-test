const assert = require('assert')

// Typescript compiles the module to an object with all named exports as properties,
// and the default export as the `default` property
const wholeModule = require('./b')

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
