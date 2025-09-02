import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   base: '/dvdms/',
  server: {
    host: '0.0.0.0',

  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          topbar: ['./src/modules/his-utils/components/sidebar/TopBar.jsx'],
          sidebar: ['./src/modules/his-utils/components/sidebar/Sidebar.jsx'],
          tabDash: ['./src/modules/his-utils/components/sidebar/TabDash.jsx'],
          parameters: ['./src/modules/his-utils/components/sidebar/Parameters.jsx'],
          WidgetDash: ['./src/modules/his-utils/components/sidebar/WidgetDash.jsx'],
          GraphDash: ['./src/modules/his-utils/components/sidebar/GraphDash.jsx'],
          TabularDash: ['./src/modules/his-utils/components/sidebar/TabularDash.jsx'],
          KpiDash: ['./src/modules/his-utils/components/sidebar/KpiDash.jsx'],
          MapDash: ['./src/modules/his-utils/components/sidebar/MapDash.jsx'],
          fontawesome: ['@fortawesome/free-solid-svg-icons'],
          proSidebar: ['react-pro-sidebar'],

        },
      },
    },
  },
})
