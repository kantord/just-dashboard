import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'dashboard',
      formats: ['umd', 'es'],
      fileName: (format) => format === 'umd' ? 'dashboard.js' : 'dashboard.es.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'nuqs', /^nuqs\//],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          nuqs: 'nuqs',
        },
      },
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
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
