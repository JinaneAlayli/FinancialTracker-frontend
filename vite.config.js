import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
 
export default defineConfig(({ mode }) => {
  
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [react()],
    build: {
     
      chunkSizeWarningLimit: 3000, 
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
