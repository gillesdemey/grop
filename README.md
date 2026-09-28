# GROP — Get Random Open Port

Returns a random open port on the host machine

ES module only. Requires Node.js `^12.20.0 || ^14.13.1 || >=16.0.0`.

Written in TypeScript; type declarations are included.

## Usage

```typescript
import grop from 'grop' // or: import { grop } from 'grop'

const port = await grop()
console.log('Available port: %d', port)
```

From CommonJS, use `await import('grop')`, or `require('grop')` on Node.js
^20.19 / >= 22.12 (which can `require()` ES modules).

With no options, `grop()` returns the lowest open port starting at `1024`, the
first port that doesn't need root/admin privileges on Unix systems.

### Port range

```javascript
const port = await grop({ min: 3000, max: 3999 })
```

Ports in the range are tried once each, starting at a random position. Busy
(`EADDRINUSE`) or forbidden (`EACCES`) ports are skipped. If none are free, the
promise rejects with an error whose `code` is `ENOPORT`. If you omit one bound,
it defaults to `1024` for `min` or `65535` for `max`. Invalid bounds reject with a
`RangeError`.

## Upgrading from 0.x

`grop` is now an ES module and no longer takes a callback; it returns a
`Promise<number>`. The minimum Node.js version is 12.20. With no options it
returns the lowest open port from `1024` upwards instead of a random
OS-assigned port. Errors other than `EADDRINUSE`/`EACCES` now reject the
promise instead of being thrown from an event handler.

## Development

Built with [Rslib](https://rslib.rs) and TypeScript 7 (Node.js ^20.19 or
>= 22.12 required for development):

```sh
npm install
npm run build   # emits dist/index.js and dist/index.d.ts
npm run dev     # rebuild on change
```
