import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
    currentTheme: 'light' | 'dark',
}

const initialState: ThemeState = {
    currentTheme: localStorage.getItem('currentTheme') != undefined ? JSON.parse(localStorage.getItem('currentTheme')!) : 'light',
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        toggleTheme: (state) => {
            const newCurrentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('currentTheme', JSON.stringify(newCurrentTheme));
            state.currentTheme = newCurrentTheme;
        }
    },
})

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;