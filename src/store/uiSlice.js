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
    openMapper(state, action) {
      
      state.showTableMapper = false;
      state.showDashboardMapper = false;
      state.showLinkMapper = false;
      
      if (action.payload === "table") state.showTableMapper = true;
      if (action.payload === "dashboard") state.showDashboardMapper = true;
      if (action.payload === "link") state.showLinkMapper = true;
    },
    closeAllMappers(state) {
      state.showTableMapper = false;
      state.showDashboardMapper = false;
      state.showLinkMapper = false;
    }
  },
});

export const { openMapper,closeAllMappers } = uiSlice.actions;
export default uiSlice.reducer;
