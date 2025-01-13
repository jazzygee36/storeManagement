// reducers/productSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorResponse {
  message: string;
  statusCode: number;
}

interface DeleteStaffResponse {
  staffId: string;
  message: string;
}

interface StaffState {
  selectedStaffId: string | null;
  staffs: Array<{ id: string; name: string }>; // Example type
}

const initialState: StaffState = {
  selectedStaffId: null,
  staffs: [],
};

// Async action to delete a product
export const deleteStaff = createAsyncThunk<
  DeleteStaffResponse,
  string,
  { rejectValue: ErrorResponse }
>('staff/deleteStaff', async (staffId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${staffId}/delete/staff`
    );
    return { staffId, message: response.data.message };
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

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setSelectedStaffId(state, action: PayloadAction<string | null>) {
      state.selectedStaffId = action.payload;
    },
  },
});

export const { setSelectedStaffId } = staffSlice.actions;

export default staffSlice.reducer;
