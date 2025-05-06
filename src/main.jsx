import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HISContextData from './modules/HisUtils/contextApi/HISContext.jsx'
import LoginContextApi from './modules/LoginWar/context/LoginContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HISContextData>
      <LoginContextApi>
        <App />
      </LoginContextApi>
    </HISContextData>
  </StrictMode>
)
