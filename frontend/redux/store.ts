import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counter/counterSlice';
import userReducer from './slice/userSlice';
import busReducer from './slice/bus/busSlice'

export const store = configureStore({
  reducer: { counter: counterReducer, user: userReducer, bus : busReducer }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
