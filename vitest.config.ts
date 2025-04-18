import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true, // Use Vitest globals (describe, it, expect, etc.)
    environment: 'jsdom', // Simulate browser environment for React components
    setupFiles: './vitest.setup.ts', // Optional setup file (we'll create a basic one)
    // You might want to configure CSS handling if needed:
    // css: true,
    // Or configure specific module resolution if facing issues later
  },
});
