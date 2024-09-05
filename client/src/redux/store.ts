// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Configure the store with the reducer
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Export store type for usage in useSelector and other hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
