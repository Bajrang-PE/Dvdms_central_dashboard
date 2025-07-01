import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mappedTables: ["Please Select"],
  schema: [],
  dashboardState: "",
  columns: {},
  joinConditions: [],
  computedColumns: [],
  fetchedColumns: [],
  fetchedData: [],
  sqlError: "",
  sqlQuery: "",
  dashboardColumns: [],
  parentWidgitState: {},
  childParams: {},
  selectedTable: undefined,
  selectedColumn: undefined,
};

const dashboardConfigSlice = createSlice({
  name: 'dashboardConfig',
  initialState,
  reducers: {
    mapTables(state, action) {
      state.mappedTables = Array.isArray(action.payload) ? action.payload : [];
    },
    setSchemas(state, action) {
      state.schema = [...new Set(action.payload.map((table) => table?.tableSchema))];
    },
    setDashboard(state, action) {
      state.dashboardState = action.payload;
    },
    setColumns(state, action) {
      state.columns = action.payload;
    },
    addTable(state, action) {
      state.selectedTable = action.payload;
    },
    addColumns(state, action) {
      state.selectedColumn = action.payload;
    },
    computeColumns(state, action) {
      state.computedColumns = action.payload;
    },
    updateJoiningCondition(state, action) {
      state.joinConditions = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchColumns(state, action) {
      state.fetchedColumns = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchData(state, action) {
      state.fetchedData = Array.isArray(action.payload) ? action.payload : [];
    },
    setSqlError(state, action) {
      state.sqlError = action.payload;
    },
    setDashboardColumns(state, action) {
      state.dashboardColumns = Array.isArray(action.payload) ? action.payload : [];
    },
    setSqlQuery(state, action) {
      state.sqlQuery = action.payload;
    },
    setParentState(state, action) {
      state.parentWidgitState = action.payload;
    },
    setChildParams(state, action) {
      state.childParams = action.payload;
    },
  },
});

export const {
  mapTables,
  setSchemas,
  setDashboard,
  setColumns,
  addTable,
  addColumns,
  computeColumns,
  updateJoiningCondition,
  fetchColumns,
  fetchData,
  setSqlError,
  setDashboardColumns,
  setSqlQuery,
  setParentState,
  setChildParams,
} = dashboardConfigSlice.actions;

export default dashboardConfigSlice.reducer;
