import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counter/counterSlice';
import userReducer from './slice/userSlice';
import busReducer from './slice/bus/busSlice'
import swdiReducer from './slice/swdi/swdiSlice'
import dashboardReducer from './slice/dashboard/dashboardSlice'
import pcnReducer from './slice/pcn/pcnSlice'

export const store = configureStore({
  reducer: { counter: counterReducer, user: userReducer, bus : busReducer, swdi : swdiReducer, dashboard : dashboardReducer, pcn: pcnReducer   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
