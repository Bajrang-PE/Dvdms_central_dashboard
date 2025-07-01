import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HISContextData from './modules/his-utils/contextApi/HISContext.jsx'
import LoginContextApi from './modules/login-war/context/LoginContext.jsx'
import { Provider } from 'react-redux';
import store from './store/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HISContextData>
        <LoginContextApi>
          <App />
        </LoginContextApi>
      </HISContextData>
    </Provider>
  </StrictMode>
)
