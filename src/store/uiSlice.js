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
      state.showTableMapper = !state.showTableMapper;
    },
    toggleDashboardMapper(state) {
      state.showDashboardMapper = !state.showDashboardMapper;
    },
    toggleLinkMapper(state) {
      state.showLinkMapper = !state.showLinkMapper;
    },
  },
});

export const { toggleTableMapper, toggleDashboardMapper, toggleLinkMapper } = uiSlice.actions;
export default uiSlice.reducer;
