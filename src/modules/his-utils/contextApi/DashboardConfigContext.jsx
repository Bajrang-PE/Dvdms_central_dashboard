import { createContext, useReducer } from "react";

const DashboardContext = createContext();

function DashboardProvider({ children }) {
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
  };

  function dashboardContextReducer(state, action) {
    switch (action.type) {
      case "MAP/TABLES":
        return {
          ...state,
          mappedTables: Array.isArray(action.payload) ? action.payload : [],
        };

      case "SET/SCHEMAS":
        return {
          ...state,
          schema: [
            ...new Set(action.payload.map((table) => table?.tableSchema)),
          ],
        };
      case "SET/DASHBOARD":
        return {
          ...state,
          dashboardState: action.payload,
        };
      case "SET/COLUMNS":
        return {
          ...state,
          columns: action.payload,
        };
      case "ADD/TABLE":
        return {
          ...state,
          selectedTable: action.payload,
        };
      case "ADD/COLUMNS":
        return {
          ...state,
          selectedColumn: action.payload,
        };
      case "COMPUTE/COLUMNS":
        return {
          ...state,
          computedColumns: action.payload,
        };

      case "UPDATE/JOINING-CONDITION":
        return {
          ...state,
          joinConditions: Array.isArray(action.payload) ? action.payload : [],
        };
      case "FETCH/COLUMNS":
        return {
          ...state,
          fetchedColumns: Array.isArray(action.payload) ? action.payload : [],
        };

      case "FETCH/DATA":
        return {
          ...state,
          fetchedData: Array.isArray(action.payload) ? action.payload : [],
        };

      case "SET/SQLERROR":
        return {
          ...state,
          sqlError: action.payload,
        };
      case "SET/DASHBOARD-COLUMNS":
        return {
          ...state,
          dashboardColumns: Array.isArray(action.payload) ? action.payload : [],
        };

      case "SET/SQLQUERY":
        return {
          ...state,
          sqlQuery: action.payload,
        };

      case "SET/PARENT-STATE":
        return {
          ...state,
          parentWidgitState: action.payload,
        };

      case "SET/CHILD-PARAMS":
        return {
          ...state,
          childParams: action.payload,
        };

      default:
        return state;
    }
  }

  const [dashboardState, dispatcher] = useReducer(
    dashboardContextReducer,
    initialState
  );

  return (
    <DashboardContext.Provider value={{ dashboardState, dispatcher }}>
      {children}
    </DashboardContext.Provider>
  );
}

export { DashboardContext, DashboardProvider };
