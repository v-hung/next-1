import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Admin as Admin2 } from '@prisma/client'

export type AdminUser = Omit<Admin2, "password"> | null

type TypeAdmin = {
  user: AdminUser
}

const initialState: TypeAdmin = {
  user: null
};

export const data = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    save: (state, action: PayloadAction<AdminUser>) => {
      state.user = action.payload
    }
  },
});

export const {
  save
} = data.actions;

export default data.reducer;
