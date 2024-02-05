import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { MyRoutes } from './service/MyRoutes';
import './locales/i18n';
import { SnackbarProvider } from './shared/alerts/SnackbarProvider';
import { useSelector } from 'react-redux';
import { RootState } from './state/store';
import { darkTheme, lightTheme } from './state/theme/themes';


function App() {
  const theme = useSelector((state: RootState) => state.theme.currentTheme)

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
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
