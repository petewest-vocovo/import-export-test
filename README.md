# Javascript and Typescript imports and exports

This is an attempt to document how Javascript and Typescript imports work with various options, including Common JS imports and exports, and relevant Typescript compiler options.

(As a reminder, Common JS modules means "module.exports" and "require").

## [Importing Common JS into TS](./js-into-ts)

When importing Common JS modules into Typescript, Typescript maps each property on `module.exports` to a named export, except `default` which is used as the default import.

Given `b.js`
```js
module.exports.foo = 1
module.exports.bar = 2
module.exports.default = { zim: 3 }
```

### Named imports

```ts
import { foo, bar } from './b'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
```

### Default imports

```ts
// This errors if there's no `default` property on `module.exports`
import zim from './b'

assert.deepStrictEqual(zim, { zim: 3 })
```

### Wildcard imports

```ts
import * as wholeModule from './b'

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
```

### Test code

```bash
npx ts-node js-into-ts/a.ts
```


## [Importing Common JS into TS with `esModuleInterop` enabled](./js-into-ts-interop)

When importing Common JS modules into Typescript with the `esModuleInterop` compiler option enabled, Typescript uses the `module.exports` object as the default export, ignoring the `default` property on `module.exports`.

Given `b.js`
```js
module.exports.foo = 1
module.exports.bar = 2
module.exports.default = { zim: 3 }
```

### Named imports

```ts
import { foo, bar } from './b'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
```

### Default imports

```ts
import wholeModule from './b'

assert.deepStrictEqual(wholeModule, { foo: 1, bar: 2, default: { zim: 3 }})
```

### Wildcard imports

```ts
import * as wrappedModule from './b'

assert.deepStrictEqual(wrappedModule, {
  foo: 1,
  bar: 2,
  default: { foo: 1, bar: 2, default: { zim: 3 }},
})
```

### Test code

```bash
npx ts-node js-into-ts-interop/a.ts
```


## [Importing JS into an ES Module](./js-into-module-js)

When we import a Common JS module into an ES Module, each property on `module.exports` is available as a named import. The default import imports the entire `module.exports` object, however this is not the case if `module.exports` was reassigned (see next section).

Given `b.js`
```js
module.exports.foo = 1
module.exports.bar = 2
```

### Named imports

```js
import { foo, bar } from './b.js'

assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
```

### Default imports

```js
import wholeModule from './b.js'

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
})
```

### Wildcard imports

```js
import * as wrappedModule from './b.js'

// Shallow clone here because `wrappedModule` is a Module object which we can't generate for testing
assert.deepStrictEqual({ ...wrappedModule }, {
  foo: 1,
  bar: 2,
  default: {
    foo: 1,
    bar: 2,
  },
})
```

### Test code

```bash
node js-into-module-js/a.mjs
```


## [Importing JS into an ES Module, reassigning `module.exports`](./js-reassigned-into-module-js)

Given `b.js`
```js
module.exports = {
  foo: 1,
  bar: 2,
}
```

### Named imports

When `module.exports` has been reassigned, we cannot import its properties as named imports. This may be because the original `module.exports` object has some special properties.

### Default imports

```js
import wholeModule from './b.js'

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
})
```

### Wildcard imports

```js
import * as wrappedModule from './b.js'

// Shallow clone here because `wrappedModule` is a Module object which we can't generate for testing
assert.deepStrictEqual({ ...wrappedModule }, {
  foo: 1,
  bar: 2,
  default: {
    foo: 1,
    bar: 2,
  },
})
```

### Test code

```bash
node js-reassigned-into-module-js/a.mjs
```


## [Importing TS into an ES Module](./ts-into-module-js)

When importing Typescript modules into ES Modules, named exports work as expected.
The default export, which is compiled as a property on `module.exports`, is ignored by ES Modules, and instead they import the entirety of `module.exports` (similar to how `esModuleInterop` works).

Given `b.ts`
```js
export const foo = 1
export const bar = 2
export default { zim: 3 }
```

### Named imports

```js
import { foo, bar } from './b.js'
assert.deepStrictEqual(foo, 1)
assert.deepStrictEqual(bar, 2)
```

### Default imports

```js
import wholeModule from './b.js'

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
```

### Wildcard imports

```js
import * as wrappedModule from './b.js'

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
```

### Test code

```bash
npx tsc -p ts-into-module-js && node ts-into-module-js/a.mjs
```


## [Importing TS into Common JS](./ts-into-js)

When importing Typescript modules into Common JS modules, Typescript compiles the module to an object with all named exports as properties, and the default export as the `default` property.

Given `b.ts`
```js
export const foo = 1
export const bar = 2
export default { zim: 3 }
```

### Common JS import

```js
const wholeModule = require('./b')

assert.deepStrictEqual(wholeModule, {
  foo: 1,
  bar: 2,
  default: { zim: 3 },
})
```

### Test code

```bash
npx tsc -p ts-into-js && node ts-into-js/a.js
```


## Notes

All Typescript examples use `"module": "commonjs"`, which means they output Common JS code.

Using `"module": "ES2020"` would cause Typescript to output ES Modules. However node will not parse ES Modules unless they have the extension `.mjs` _or_ `"type": "module"` is set in package.json.

Doing this would make ES Modules the default in that project and any Common JS modules would then need to have the `.cjs` extension.
