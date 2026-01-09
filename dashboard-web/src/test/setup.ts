import '@testing-library/jest-dom'

// Polyfill fetch if needed by tests (jsdom 20 has fetch, but keep fallback)
if (!('fetch' in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  globalThis.fetch = require('node-fetch')
}




