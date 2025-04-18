// Optional: Import Jest DOM matchers for convenience
import '@testing-library/jest-dom/vitest';

// You can add other global setup here if needed, e.g.:
// - Mocking global objects (fetch, localStorage)
// - Setting up MSW (Mock Service Worker)

// Example of mocking fetch:
// import { vi } from 'vitest';
// global.fetch = vi.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//     ok: true,
//   })
// );
