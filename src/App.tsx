import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { CssBaseline } from '@mui/material';
import { MyRoutes } from './service/MyRoutes';
import './locales/i18n';
import { SnackbarProvider } from './shared/alerts/SnackbarProvider';
import { MyThemeProvider } from './themes/ThemeContext';


function App() {
  return (
    <MyThemeProvider>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </MyThemeProvider>
  )
}

export default App
