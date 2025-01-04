import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';

interface UserLogin {
  email: string;
  password: string;
}

const initialState: UserLogin = {
  email: '',
  password: '',
};

export const userLoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserLogin: (state, action: PayloadAction<UserLogin>) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },

    clearUserLogin: (state) => {
      state.email = '';
      state.password = '';
    },
  },
});

export const { setUserLogin, clearUserLogin } = userLoginSlice.actions;

export const selectUserLogin = (state: RootState): UserLogin => state.login;

export default userLoginSlice.reducer;
