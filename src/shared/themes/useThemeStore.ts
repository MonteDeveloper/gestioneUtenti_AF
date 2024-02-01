import { create } from 'zustand';
import { createTheme, Theme } from '@mui/material/styles';

interface ThemeStore {
    darkMode: boolean;
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
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#FFF8E3',
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
                    },
                },
            },
            MuiListItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#303134',
                    },
                },
            },
        },
    });

    return {
        darkMode: false,
        toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        lightTheme,
        darkTheme,
    };
});

export default useThemeStore;
