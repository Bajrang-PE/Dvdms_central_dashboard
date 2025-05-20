import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  
    // port: 5173,  
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          topbar: ['./src/modules/HisUtils/components/sidebar/TopBar.jsx'], 
          sidebar: ['./src/modules/HisUtils/components/sidebar/Sidebar.jsx'], 
          tabDash: ['./src/modules/HisUtils/components/sidebar/TabDash.jsx'], 
          parameters: ['./src/modules/HisUtils/components/sidebar/Parameters.jsx'], 
          WidgetDash: ['./src/modules/HisUtils/components/sidebar/WidgetDash.jsx'], 
          GraphDash: ['./src/modules/HisUtils/components/sidebar/GraphDash.jsx'], 
          TabularDash: ['./src/modules/HisUtils/components/sidebar/TabularDash.jsx'], 
          KpiDash: ['./src/modules/HisUtils/components/sidebar/KpiDash.jsx'], 
          MapDash: ['./src/modules/HisUtils/components/sidebar/MapDash.jsx'], 
          fontawesome: ['@fortawesome/free-solid-svg-icons'],
          proSidebar: ['react-pro-sidebar'],

        },
      },
    },
  },
})
