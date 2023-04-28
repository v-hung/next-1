import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Admin as Admin2 } from '@prisma/client'

type Admin = Omit<Admin2, "password"> | null

type TypeAdmin = {
  user: Admin
}

const initialState: TypeAdmin = {
  user: null
};

export const data = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Admin>) => {
      state.user = action.payload
    }
  },
});

export const {
  save
} = data.actions;

export default data.reducer;
