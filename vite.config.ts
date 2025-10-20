import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        changeOrigin:true,
        secure:false,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  },
  build: {
    rollupOptions: {
      output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {
              if(id.includes('axios')){
                return 'axios'
              }
              if(id.includes('react')){
                return 'react'
              }
              if(id.includes('antd')){
                return 'antd'
              }
              return 'vendor'
          }
        }
      }
    }
  },
})
