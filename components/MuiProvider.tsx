'use client'

import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from '@mui/material'
import React from "react";
import { Roboto } from 'next/font/google'

const font = Roboto({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin']
})

const blackBase = '#27272a';
const blackMain = alpha(blackBase, 0.7);

const whiteBase = '#fff';
const whiteMain = alpha(whiteBase, 0.7);

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    // @ts-ignore
    black: {
      main: blackMain,
      light: alpha(blackBase, 0.5),
      dark: alpha(blackBase, 0.9),
      contrastText: getContrastRatio(blackMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    white: {
      main: whiteMain,
      light: alpha(whiteBase, 0.5),
      dark: alpha(whiteBase, 0.9),
      contrastText: getContrastRatio(whiteMain, '#fff') > 4.5 ? '#fff' : '#111',
    }
  },
  typography: {
    fontFamily: font.style.fontFamily
  }
})

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    black: true,
    white: true,
  }
}

const MuiProvider: React.FC<{
  children: React.ReactNode
}> = ({children}) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <style global jsx>
        {`html {
          font-family: ${font.style.fontFamily};
        }`}
      </style>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

export default MuiProvider