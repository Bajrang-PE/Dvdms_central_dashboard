import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clauses: [],
};

const clauseSlice = createSlice({
  name: 'clause',
  initialState,
  reducers: {
    addClause(state, action) {
      state.clauses.push({ id: action.payload.id, selectedClause: '', config: {} });
    },
    updateClause(state, action) {
      state.clauses = state.clauses.map((clause) =>
        clause.id === action.payload.id
          ? { ...clause, selectedClause: action.payload.selectedClause }
          : clause
      );
    },
    removeClause(state, action) {
      state.clauses = state.clauses.filter((clause) => clause.id !== action.payload.id);
    },
    updateClauseConfig(state, action) {
      state.clauses = state.clauses.map((clause) =>
        clause.id === action.payload.id
          ? { ...clause, config: { ...clause.config, ...action.payload.config } }
          : clause
      );
    },
    resetClauses() {
      return initialState;
    },
  },
});

export const { addClause, updateClause, removeClause, updateClauseConfig, resetClauses } = clauseSlice.actions;
export default clauseSlice.reducer;
