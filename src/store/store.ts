import { configureStore } from '@reduxjs/toolkit';
import storeReducer from './invoiceSlice';

export const store = configureStore({
  reducer: storeReducer
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
