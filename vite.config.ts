/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const isTest = Boolean(process.env.VITEST)

const src = (path = '') => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// Folder import aliases: `@components/...`, `@utils`, etc. Keep in sync with
// "paths" in tsconfig.json and tsconfig.app.json. (`types/` is excluded — it
// would clash with npm's @types/* packages, and nothing imports it.)
const aliasedFolders = [
  'assets',
  'components',
  'config',
  'constants',
  'hooks',
  'layouts',
  'pages',
  'resources',
  'styles',
  'test',
  'utils',
]

// https://vite.dev/config/
export default defineConfig({
  // The React Router plugin builds the app and prerenders pages; Vitest renders
  // components directly, so it's skipped there.
  plugins: [tailwindcss(), svgr(), !isTest && reactRouter()],
  server: {
    port: 3000,
    // Open the site in your default browser when `npm run dev` starts.
    open: true,
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: [
      // Exact match on the folder name, so e.g. `@test` doesn't catch `@testing-library`.
      ...aliasedFolders.map((folder) => ({
        find: new RegExp(`^@${folder}(?=/|$)`),
        replacement: src(folder),
      })),
      { find: /^@\//, replacement: src() },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/test/**/*.test.{ts,tsx}'],
    css: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/root.tsx', 'src/components/ui/**'],
    },
  },
})
