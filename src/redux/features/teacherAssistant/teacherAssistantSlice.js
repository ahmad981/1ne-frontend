// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axios from '../../http';
import endPoints from '../../constant';

// Initial state for teacher assistant
const initialState = {
  data: null,
  loading: false,
  error: null,
};

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Example: Get Teacher Assistant Data API Function (fake URL)
export const getTeacherAssistantData = createAsyncThunk(
  'teacherAssistant/getData',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(endPoints.teacherAssistant, { params });
      return data?.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Example: Create Teacher Assistant Data API Function
export const createTeacherAssistantData = createAsyncThunk(
  'teacherAssistant/createData',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(endPoints.teacherAssistant, formData);
      return data?.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Reducers
export const teacherAssistantSlice = createSlice({
  name: 'teacherAssistant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTeacherAssistantData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTeacherAssistantData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(getTeacherAssistantData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTeacherAssistantData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeacherAssistantData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(createTeacherAssistantData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearData } = teacherAssistantSlice.actions;

export default teacherAssistantSlice.reducer;

