import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../models/user";
import { pb } from "../../pocketbase";
import { store } from "../store";
import { updateTotalPages } from "../pagination/paginationSlice";

interface UsersListState {
    usersList: User[],
}

const initialState: UsersListState = {
    usersList: [],
}

const usersListSlice = createSlice({
    name: "usersList",
    initialState,
    reducers: {
        updateGlobalListUsers: (state, action: PayloadAction<User[]>) => {
            state.usersList = action.payload;
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchUsersAsync.pending, () => {
    //             console.log("pending fetch users");
    //         })
    //         .addCase(fetchUsersAsync.fulfilled, (state, action) => {
    //             state.usersList = [...action.payload.items];
    //             store.dispatch(updateTotalPages(action.payload.totalPages));
    //         })
    // },
})

// export const fetchUsersAsync = createAsyncThunk(
//     "usersList/fetchUsersAsync",
//     async (searchValue?: string) => {
//         let query = pb.collection('usersData');
          
//         const currentPage = store.getState().pagination.currentPage;
//         const itemPerPage = store.getState().pagination.rowsPerPage;
      
//         if (searchValue) {
//           const users = await query.getList<User>(currentPage, itemPerPage, {
//             filter: `name ~ "${searchValue}" || surname ~ "${searchValue}" || email ~ "${searchValue}"`,
//           });
//           return users;
//         }
      
//         const users = await query.getList<User>(currentPage, itemPerPage);
//         return users;
//     }
// )

export const { updateGlobalListUsers } = usersListSlice.actions;

export default usersListSlice.reducer;