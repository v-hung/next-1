import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  open: true,
  width: "16rem",
  minWidth: "60px"
};

export const menu = createSlice({
  name: "adminMenu",
  initialState,
  reducers: {
    toggle: (state) => {
      state.open = !state.open;
    }
  },
});

export const {
  toggle
} = menu.actions;

export default menu.reducer;
