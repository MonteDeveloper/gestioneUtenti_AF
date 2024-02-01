import React, { createContext, useContext, useState, ReactNode } from 'react';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';

interface ThemeContextProps {
  children: ReactNode;
}

interface ThemeContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export const MyThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme: Theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: darkMode ? '#202124' : '#F5EEE6',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#303134' : '#FFF8E3',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#303134' : '#FFF8E3',
          },
        },
      },
    },
  });

  const value: ThemeContextValue = {
    darkMode,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
