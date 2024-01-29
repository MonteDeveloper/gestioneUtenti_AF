import { BrowserRouter } from 'react-router-dom';
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material';
import { MyRoutes } from './service/MyRoutes';
import './locales/i18n';


function App() {
  const themeSettings = createTheme({
    palette: {
      mode: 'light',
    }
  });

  return (
    <ThemeProvider theme={themeSettings}>
      <BrowserRouter>
          <MyRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
