import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showTableMapper: false,
  showDashboardMapper: false,
  showLinkMapper: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTableMapper(state) {
      state.showTableMapper = true;
      state.showDashboardMapper = false;
      state.showLinkMapper = false;
    },
    toggleDashboardMapper(state) {
      state.showTableMapper = false;
      state.showDashboardMapper = true;
      state.showLinkMapper = false;
    },
    toggleLinkMapper(state) {
      state.showTableMapper = false;
      state.showDashboardMapper = false;
      state.showLinkMapper = true;
    },
  },
});

export const { toggleTableMapper, toggleDashboardMapper, toggleLinkMapper } = uiSlice.actions;
export default uiSlice.reducer;
