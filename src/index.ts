import { type AddressInfo, createServer } from 'node:net';

const MIN_PORT = 1;
const MAX_PORT = 65535;
// Ports below 1024 need root/admin privileges to bind on most Unix systems.
const FIRST_UNPRIVILEGED_PORT = 1024;

export interface GropOptions {
  /** Lowest port to consider (inclusive). Defaults to 1024. */
  min?: number;
  /** Highest port to consider (inclusive). Defaults to 65535. */
  max?: number;
}

function listen(port: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(port, () => {
      const { port: bound } = server.address() as AddressInfo;
      server.close(() => resolve(bound));
    });
  });
}

function validatePort(name: string, value: number): void {
  if (!Number.isInteger(value) || value < MIN_PORT || value > MAX_PORT) {
    throw new RangeError(
      `${name} must be an integer between ${MIN_PORT} and ${MAX_PORT}, got ${value}`,
    );
  }
}

// Tries every port in [min, max] exactly once, starting at min + offset and wrapping.
async function scan(min: number, max: number, offset: number): Promise<number> {
  const size = max - min + 1;
  for (let i = 0; i < size; i++) {
    const port = min + ((offset + i) % size);
    try {
      return await listen(port);
    } catch (err) {
      const { code } = err as NodeJS.ErrnoException;
      if (code !== 'EADDRINUSE' && code !== 'EACCES') throw err;
    }
  }
  throw Object.assign(new Error(`No open port found between ${min} and ${max}`), {
    code: 'ENOPORT',
  });
}

/**
 * Resolves with an open port on the host machine.
 *
 * Without options, returns the lowest open port from 1024 upwards. With `min`
 * and/or `max`, tries each port in the range once, starting at a random
 * position. Rejects with `code: 'ENOPORT'` when no port in the range is free.
 */
export async function grop(options: GropOptions = {}): Promise<number> {
  if (options.min === undefined && options.max === undefined) {
    return scan(FIRST_UNPRIVILEGED_PORT, MAX_PORT, 0);
  }

  const min = options.min === undefined ? FIRST_UNPRIVILEGED_PORT : options.min;
  const max = options.max === undefined ? MAX_PORT : options.max;
  validatePort('min', min);
  validatePort('max', max);
  if (min > max) {
    throw new RangeError(`min (${min}) must not be greater than max (${max})`);
  }

  return scan(min, max, Math.floor(Math.random() * (max - min + 1)));
}

export default grop;
