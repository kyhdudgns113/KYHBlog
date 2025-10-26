import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {clientIP, clientPort} from './src/base/secret'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // ['@babel/plugin-proposal-decorators', {legacy: true}],
          // ['@babel/plugin-proposal-class-properties', {loose: true}]
        ]
      }
    }),
    tsconfigPaths()
  ],
  server: {
    host: clientIP,
    port: clientPort
  }
})
