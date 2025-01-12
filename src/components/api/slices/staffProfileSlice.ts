import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorPayload {
  message: string;
  statusCode: number;
}

interface StaffProfile {
  id: string;
  name: string;
  position: string;
  username: string; // Ensure this field exists
  phoneNumber: string; // Ensure this field exists
  // Additional fields can be added as required
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
export const fetchStaffs = createAsyncThunk<
  StaffProfile[], // Success return type
  string, // Argument type
  { rejectValue: ErrorPayload } // Reject value type
>('staffProfile/fetchStaffs', async (userId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${userId}/all-staffs`
    );
    return res.data; // Assuming the response contains the list of staffs
  } catch (error: unknown) {
    // Type guard to ensure error is an instance of AxiosError
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Unknown error occurred',
          statusCode: 500,
        }
      );
    }
    return rejectWithValue({
      message: 'Unknown error occurred',
      statusCode: 500,
    });
  }
});

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
      .addCase(
        fetchStaffs.rejected,
        (state, action: PayloadAction<ErrorPayload | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || 'Unknown error occurred';
        }
      );
  },
});

export const { addStaff } = staffProfileSlice.actions;

export default staffProfileSlice.reducer;
