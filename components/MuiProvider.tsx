'use client'

import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from '@mui/material'
import React from "react";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const MuiProvider: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default MuiProvider