// redux/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.ts';
import postsReducer from './slices/allPostSlice.ts';
import suggestedUsersReducer from './slices/suggestedUsersSlice.ts';
import socketReducer from './slices/socketSlice.ts';
import chatReducer from './slices/chatSlice.ts';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist';

// Persist configuration with selective persist for `auth` slice
const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth','suggestedUsers'],  // Only persist `auth` slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  suggestedUsers: suggestedUsersReducer,
  socket: socketReducer,
  chat: chatReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
