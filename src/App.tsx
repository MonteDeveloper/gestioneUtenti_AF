import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MyRoutes } from './service/MyRoutes';
import './locales/i18n';
import { SnackbarProvider } from './shared/alerts/SnackbarProvider';
import useThemeStore from './shared/themes/useThemeStore';


function App() {
  const { isDarkMode, lightTheme, darkTheme } = useThemeStore();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <MyRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
