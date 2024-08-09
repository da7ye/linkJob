// actions/workerActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchWorkers = createAsyncThunk(
  'worker/fetchWorkers',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.access;
      const response = await axios.get('http://localhost:8000/api/workers/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
