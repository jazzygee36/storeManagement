import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';

interface UserSignUp {
  email: string;
  username: string;
  password: string;
}

const initialState: UserSignUp = {
  email: '',
  password: '',
  username: '',
};

export const userSignUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setUserSignUp: (state, action: PayloadAction<UserSignUp>) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.username = action.payload.username;
    },

    clearUserSignUp: (state) => {
      state.email = '';
      state.password = '';
      state.username = '';
    },
  },
});

export const { setUserSignUp, clearUserSignUp } = userSignUpSlice.actions;

export const selectUserSignUp = (state: RootState): UserSignUp => state.signUp;

export default userSignUpSlice.reducer;
