import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from './route/Router'
import { ThemeProvider } from '@mui/material'
import { theme } from './utils/themecolor'

function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
    </>
  )
}

export default App
