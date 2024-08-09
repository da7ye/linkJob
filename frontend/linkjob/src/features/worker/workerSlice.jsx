import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  workers: [],
  isLoading: false,
  isError: false,
  message: '',
};

export const createWorker = createAsyncThunk(
  'worker/createWorker',
  async (workerData, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.access;
      const response = await axios.post('http://localhost:8000/api/become-worker/', workerData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      // Extract a more detailed error message from the server response
      const message = 
        error.response?.data?.detail || // If using DRF and the error message is in `detail`
        error.response?.data?.message || // If the message is in `message`
        error.response?.data || // Fallback to any data provided in response
        error.message || 
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const workerSlice = createSlice({
  name: 'worker',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createWorker.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorker.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workers.push(action.payload);
      })
      .addCase(createWorker.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = workerSlice.actions;
export default workerSlice.reducer;
