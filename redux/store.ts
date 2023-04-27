import { configureStore } from "@reduxjs/toolkit";
import menuSlide from "./admin/menuSlide";

export const store = configureStore({
  reducer: {
    menuSlide
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
