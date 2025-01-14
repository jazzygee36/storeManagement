import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../state/store';

interface StaffLogin {
  username: string;
  phoneNumber: string;
}

const initialState: StaffLogin = {
  username: '',
  phoneNumber: '',
};

export const staffLoginSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    setStaffLogin: (state, action: PayloadAction<StaffLogin>) => {
      state.username = action.payload.username;
      state.phoneNumber = action.payload.phoneNumber;
    },

    clearUserLogin: (state) => {
      state.username = '';
      state.phoneNumber = '';
    },
  },
});

export const { setStaffLogin, clearUserLogin } = staffLoginSlice.actions;

export const selectStaffLogin = (state: RootState): StaffLogin =>
  state.staffLogin;

export default staffLoginSlice.reducer;
