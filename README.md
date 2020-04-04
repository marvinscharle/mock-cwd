# mock-cwd
A useful test helper when you’re working with `process.cwd()`.

This helper mocks the value of `process.cwd()` with a user-specified directory or with a randomly generated folder within the system’s temp folder.

## Install
Install using npm or yarn:

```
npm i mock-cwd —save-dev
yarn i --dev mock-cwd
```

This package contains TypeScript definitions.

## How to Use
### With Block
Wraps the mock inside a user-provided block. The block can be an `async` function, if your operations are asynchronously.

In the following example, it will create a new temporary folder and restore the real cwd after the block has been left.

```typescript
import { mockCwd } from 'mock-cwd';

mockCwd(() => {
	console.log(process.cwd()); // => /private/var/folders/...
});

console.log(process.cwd()); // => /your/real/cwd
```

You can also supply a path to an existing directory:

```typescript
import { mockCwd } from 'mock-cwd';

mockCwd('/your/custom/path', () => {
	console.log(process.cwd()); // => /your/custom/path
});

console.log(process.cwd()); // => /your/real/cwd
```

### Without a Block
Updates `process.cwd()` to the given or automatically generated path. Returns an object to restore the original path.

```typescript
import { mockCwd } from 'mock-cwd';

const mock = mockCwd();
console.log(process.cwd()); // => /private/var/folders/...

mock.restore();
console.log(process.cwd()); // => /your/real/cwd
```

As before, you can also supply a custom path to an existing directory:

```typescript
import { mockCwd } from 'mock-cwd';

const mock = mockCwd('/your/custom/path');
console.log(process.cwd()); // => /your/custom/path

mock.restore();
console.log(process.cwd()); // => /your/real/cwd
```
