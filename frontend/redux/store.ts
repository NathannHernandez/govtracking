import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counter/counterSlice';
import userReducer from './slice/userSlice';

export const store = configureStore({
  reducer: { counter: counterReducer, user: userReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
