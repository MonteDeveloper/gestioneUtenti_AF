import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./theme/themeSlice";
import paginationSlice from "./pagination/paginationSlice";
import usersListSlice from "./usersList/usersListSlice";

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        pagination: paginationSlice,
        usersList: usersListSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;