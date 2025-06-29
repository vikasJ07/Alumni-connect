import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Holds user data (if logged in)
        role: null, // Stores the role of the user ('admin', 'alumni', or 'user')
        token: null, // Stores the JWT token
        id: null,
    },
    reducers: {
        login: (state, action) => {
            const { username, role, token, id } = action.payload;
            state.user = username;
            state.role = role;
            state.token = token;
            state.id = id;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.token = null;
            state.id = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;


