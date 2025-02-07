import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyEmail = createAsyncThunk(
  'emailVerification/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          'Verification failed'
      );
    }
  }
);

interface EmailVerificationState {
  message: string;
  loading: boolean;
  error: string | null;
}

const initialState: EmailVerificationState = {
  message: '',
  loading: false,
  error: null,
};

const emailVerificationSlice = createSlice({
  name: 'emailVerification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default emailVerificationSlice.reducer;
