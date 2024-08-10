import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user || null,
    userInfo: {},
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

const handleThunk = async (thunkAPI, serviceFunc, ...params) => {
    try {
        return await serviceFunc(...params);
    } catch (error) {
        const message = error.response?.data?.detail || error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
};
export const register = createAsyncThunk("auth/register", (userData, thunkAPI) => handleThunk(thunkAPI, authService.register, userData));
export const login = createAsyncThunk("auth/login", (userData, thunkAPI) => handleThunk(thunkAPI, authService.login, userData)); // Make sure this is included
export const logout = createAsyncThunk("auth/logout", async () => authService.logout());
export const activate = createAsyncThunk("auth/activate", (userData, thunkAPI) => handleThunk(thunkAPI, authService.activate, userData));
export const resetPassword = createAsyncThunk("auth/resetPassword", (userData, thunkAPI) => handleThunk(thunkAPI, authService.resetPassword, userData));
export const resetPasswordConfirm = createAsyncThunk("auth/resetPasswordConfirm", (userData, thunkAPI) => handleThunk(thunkAPI, authService.resetPasswordConfirm, userData));
export const getUserInfo = createAsyncThunk("auth/getUserInfo", (_, thunkAPI) => {
    const accessToken = thunkAPI.getState().auth.user?.access;
    return handleThunk(thunkAPI, authService.getUserInfo, accessToken);
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.userInfo = {};
                state.isError = false;
                state.isSuccess = false;
                state.message = "";
            })            
            .addCase(activate.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(activate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(activate.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(resetPasswordConfirm.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(resetPasswordConfirm.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
    