import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  postgresForm: false,
  oracleForm: false,
  edbForm: false,
  hostname: "",
  port: 0,
  serviceName: "",
  userName: "",
  password: "",
  currentDB: "",
};

const dbFormSlice = createSlice({
  name: 'dbForm',
  initialState,
  reducers: {
    togglePostgresForm(state) {
      state.postgresForm = !state.postgresForm;
      state.oracleForm = false;
      state.edbForm = false;
      state.currentDB = 'postgres';
    },
    toggleOracleForm(state) {
      state.oracleForm = !state.oracleForm;
      state.postgresForm = false;
      state.edbForm = false;
      state.currentDB = 'oracle';
    },
    toggleEdbForm(state) {
      state.edbForm = !state.edbForm;
      state.oracleForm = false;
      state.postgresForm = false;
      state.currentDB = 'edb';
    },
    updateHostname(state, action) { state.hostname = action.payload; },
    updatePort(state, action) { state.port = action.payload; },
    updateSID(state, action) { state.serviceName = action.payload; },
    updateUsername(state, action) { state.userName = action.payload; },
    updatePassword(state, action) { state.password = action.payload; },
    resetForm() { return initialState; },
  },
});

export const {
  togglePostgresForm,
  toggleOracleForm,
  toggleEdbForm,
  updateHostname,
  updatePort,
  updateSID,
  updateUsername,
  updatePassword,
  resetForm,
} = dbFormSlice.actions;

export default dbFormSlice.reducer;
