import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
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
    include: ['src/**/*.test.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
