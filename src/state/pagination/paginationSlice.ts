import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// type RowsPerPage = 3 | 5 | 7 | 10 | 15 | 20;

interface PaginationState {
    currentPage: number,
    rowsPerPage: number,
    totalPages: number,
}

const initialState: PaginationState = {
    currentPage: 1,
    rowsPerPage: localStorage.getItem('rowsPerPage') != undefined ? JSON.parse(localStorage.getItem('rowsPerPage')!) : 7,
    totalPages: 0
}

const paginationSlice = createSlice({
    name: "pagination",
    initialState,
    reducers: {
        goToPage: (state, action: PayloadAction<{newCurrentPage: number}>) => {
            const {newCurrentPage} = action.payload;
            if (newCurrentPage > 0 && state.totalPages >= newCurrentPage) {
                state.currentPage = newCurrentPage;
            }
        },
        setRowsPerPage: (state, action: PayloadAction<number>) => {
            const newRowsPerPage = action.payload;
            if(state.rowsPerPage != newRowsPerPage){
                localStorage.setItem('rowsPerPage', JSON.stringify(newRowsPerPage));
                state.rowsPerPage = newRowsPerPage;
                state.currentPage = 1;
            }
        },
        updateTotalPages: (state, action: PayloadAction<number>) => {
            const newTotalPages = action.payload;
            if(newTotalPages > 0){
                state.totalPages = newTotalPages;
            }
        }
    },
})

export const { goToPage, setRowsPerPage, updateTotalPages } = paginationSlice.actions;

export default paginationSlice.reducer;