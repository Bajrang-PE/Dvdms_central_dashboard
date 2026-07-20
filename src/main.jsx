import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LoginContextApi from './modules/login-war/context/LoginContext.jsx'
import HISContextData from './modules/his-utils/contextApi/HISContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <HISContextData>
        <LoginContextApi>
          <App />
        </LoginContextApi>
      </HISContextData>
    </BrowserRouter>
  </StrictMode>
)
