import { create } from 'zustand';
import { createTheme, Theme } from '@mui/material/styles';

interface ThemeStore {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    lightTheme: Theme;
    darkTheme: Theme;
}

const useThemeStore = create<ThemeStore>((set) => {
    const lightTheme: Theme = createTheme({
        palette: {
            mode: 'light',
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#F5EEE6',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#FFF8E3',
                        transition: 'background .2s'
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#FFF8E3',
                        transition: 'background .2s'
                    },
                },
            },
        },
    });

    const darkTheme: Theme = createTheme({
        palette: {
            mode: 'dark',
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#202124',
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#303134',
                        transition: 'background .2s'
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#303134',
                        transition: 'background .2s'
                    },
                },
            },
        },
    });

    return {
        isDarkMode: localStorage.getItem('isDarkMode') != undefined ? JSON.parse(localStorage.getItem('isDarkMode')!) : false,
        toggleDarkMode: () => {
            set((state) => {
                const newIsDarkMode = !state.isDarkMode;
                localStorage.setItem('isDarkMode', JSON.stringify(newIsDarkMode));
                return { isDarkMode: newIsDarkMode };
              });
        },
        lightTheme,
        darkTheme,
    };
});

export default useThemeStore;
