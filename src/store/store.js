import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import hisReducer from './hisSlice';
import loginReducer from './loginSlice';
import dashboardConfigReducer from './dashboardConfigSlice';
import dbFormReducer from './dbFormSlice';
import clauseReducer from './clauseSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    his: hisReducer,
    login: loginReducer,
    dashboardConfig: dashboardConfigReducer,
    dbForm: dbFormReducer,
    clause: clauseReducer,
  },
});

export default store;
