import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PasswordResetState {
  loading: boolean;
  message: string;
  error: string | null;
  tokenVerified: boolean;
}

const initialState: PasswordResetState = {
  loading: false,
  message: '',
  error: null,
  tokenVerified: false,
};

// ✅ Verify Reset Token
export const verifyResetToken = createAsyncThunk(
  'passwordReset/verifyResetToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-reset-token`,
        { token }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          'Token verification failed'
      );
    }
  }
);

// ✅ Reset Password
export const resetPassword = createAsyncThunk(
  'passwordReset/resetPassword',
  async (
    { token, newPassword }: { token: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
        { token, newPassword }
      );
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(
        (axios.isAxiosError(error) && error.response?.data?.message) ||
          'Password reset failed'
      );
    }
  }
);

const passwordResetSlice = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = '';
      state.error = null;
      state.tokenVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyResetToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetToken.fulfilled, (state, action) => {
        state.loading = false;
        state.tokenVerified = true;
        state.message = action.payload.message;
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.loading = false;
        state.tokenVerified = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage } = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
