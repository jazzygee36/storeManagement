import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface StaffProfile {
  id: string;
  name: string;
  position: string;
  username: string; // Ensure this field exists
  phoneNumber: string; // Ensure this field exists
  // email: string;
  // For additional fields
}

interface StaffProfileState {
  staffs: StaffProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffProfileState = {
  staffs: [],
  loading: false,
  error: null,
};

// Async thunk to fetch staff data
export const fetchStaffs = createAsyncThunk(
  'staffProfile/fetchStaffs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/all-staffs`
      );
      return res.data; // Assuming the response contains the list of staffs
    } catch (err: unknown) {
      const error = err as any;
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch staff data'
      );
    }
  }
);

const staffProfileSlice = createSlice({
  name: 'staffProfile',
  initialState,
  reducers: {
    addStaff: (state, action: PayloadAction<StaffProfile>) => {
      state.staffs.push(action.payload); // Add the new staff to the existing array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStaffs.fulfilled,
        (state, action: PayloadAction<StaffProfile[]>) => {
          state.loading = false;
          state.staffs = action.payload;
        }
      )
      .addCase(fetchStaffs.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addStaff } = staffProfileSlice.actions;

export default staffProfileSlice.reducer;

// export default staffProfileSlice.reducer;
