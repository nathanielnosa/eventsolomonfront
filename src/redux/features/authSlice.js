import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,  // ✅ Store token
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
 
        loginSuccess: (state, action) => {
            state.token = action.payload.token;  // ✅ Save token
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;  // ✅ Clear token
            state.isAuthenticated = false;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
