import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the base API URL

// Async action to update the payment method
export const updatePaymentMethod = createAsyncThunk(
  'payment/updatePaymentMethod',
  async (customerNumber: number, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/update-payment/${customerNumber}`
      );
      return response.data; // Returns updated message
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data || 'An error occurred');
      }
      return rejectWithValue('An error occurred');
    }
  }
);

// Define the initial state
interface PaymentState {
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  successMessage: null,
};

// Create Redux slice
const updatePaymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(
        updatePaymentMethod.fulfilled,
        (state, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.successMessage = (
            action.payload as { message: string }
          ).message;
        }
      )
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = updatePaymentSlice.actions;
export default updatePaymentSlice.reducer;
