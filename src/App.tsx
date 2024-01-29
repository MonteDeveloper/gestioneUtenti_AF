import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material';
import { MyRoutes } from './service/MyRoutes';
import './locales/i18n';
import { SnackbarProvider } from './shared/alerts/SnackbarProvider';


function App() {
  const themeSettings = createTheme({
    palette: {
      mode: 'light',
    }
  });

  return (
    <ThemeProvider theme={themeSettings}>
      <SnackbarProvider>
        <BrowserRouter>
            <MyRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
