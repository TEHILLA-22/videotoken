import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    userId: string | null;
    email: string | null;
    role: string | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    userId: null,
    email: null,
    role: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                token: string;
                userId: string;
                email: string;
                role: string;
            }>
        ) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        resetUser: (state) => {
            state.token = null;
            state.userId = null;
            state.email = null;
            state.role = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, resetUser } = authSlice.actions;
export default authSlice.reducer;
export type { AuthState };
