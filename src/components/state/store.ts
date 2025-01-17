import { configureStore } from '@reduxjs/toolkit';
import userLoginReducer from '../api/slices/loginSlice';
import userProfileReducer from '../api/slices/userProfileSlice';
import userSignUpReducer from '../api/slices/signUpSlice';
import staffProfileReducer from '../api/slices/staffProfileSlice';
import productReducer from '../api/slices/deleteSlice'; // Ensure the file exists at this path
import deleteStaffReducer from '../api/slices/deleteStaffSlice';
import staffLoginReducer from '../api/slices/staffLoginSlice';
import staffProductReducer from '../api/slices/staffProductsSlice';
import salesReducer from '../api/slices/salesSlice';

export const store = configureStore({
  reducer: {
    login: userLoginReducer,
    userProfile: userProfileReducer,
    signUp: userSignUpReducer,
    staffProfile: staffProfileReducer,
    product: productReducer,
    deleteStaff: deleteStaffReducer,
    staffLogin: staffLoginReducer,
    staffProduct: staffProductReducer,
    sales: salesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
