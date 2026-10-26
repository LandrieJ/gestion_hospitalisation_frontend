import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8C2E47',
      light: '#d985a5',
      dark: '#6d1c3e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#279C6A',
      light: '#7bcca2',
      dark: '#1b6d4a',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#37474f',
      light: '#62727b',
      dark: '#102027',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});
