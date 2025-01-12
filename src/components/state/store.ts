import { configureStore } from '@reduxjs/toolkit';
import userLoginReducer from '../api/slices/loginSlice';
import userProfileReducer from '../api/slices/userProfileSlice';
import userSignUpReducer from '../api/slices/signUpSlice';
import staffProfileReducer from '../api/slices/staffProfileSlice';
import productReducer from '../api/slices/deleteSlice'; // Ensure the file exists at this path

export const store = configureStore({
  reducer: {
    login: userLoginReducer,
    userProfile: userProfileReducer,
    signUp: userSignUpReducer,
    staffProfile: staffProfileReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
