import { configureStore } from "@reduxjs/toolkit";
import adminMenu from "./admin/adminMenu";
import adminUser from "./admin/adminUser";

export const store = configureStore({
  reducer: {
    adminMenu,
    adminUser
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
