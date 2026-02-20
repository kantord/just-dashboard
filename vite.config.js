import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'dashboard',
      formats: ['umd', 'es'],
      fileName: (format) => format === 'umd' ? 'dashboard.js' : 'dashboard.es.js',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'https://fake.url.com'
      }
    },
    include: ['src/**/*.test.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
