import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASEURL,
          changeOrigin: true,
          secure: false
        }
      },
      historyApiFallback: true
    },
    build: {
      sourcemap: mode === 'development',
      minify: mode === 'production',
      outDir: 'dist'
    }
  }
})
