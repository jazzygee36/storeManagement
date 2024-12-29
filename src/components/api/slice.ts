import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: null,
};

export const loginUser = createAsyncThunk<
  User, // Return type on success
  UserCredentials, // Argument type
  { rejectValue: string } // Rejected value type
>('user/loginUser', async (userCredentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
      userCredentials
    );
    const user = response.data.data;
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'An unexpected error occurred'
    );
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(
        loginUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.user = null;
          state.error = action.payload || 'Login failed';
        }
      );
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
