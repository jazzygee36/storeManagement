import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../api/slice';

// Create and configure the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer types for AppDispatch and RootState for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
