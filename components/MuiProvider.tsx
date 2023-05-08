'use client'

import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from '@mui/material'
import React from "react";
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: roboto.style.fontFamily
  }
});

const MuiProvider: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <style global jsx>
        {`html {
          font-family: ${roboto.style.fontFamily};
        }`}
      </style>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default MuiProvider