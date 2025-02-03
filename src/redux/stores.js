import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import eventsReducer from './features/eventSlice';
import groupsReducer from './features/groupSlice';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  
  import storage from 'redux-persist/lib/storage'
  
  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'events', 'groups']
  }
// Combine all reducers
const rootReducer = combineReducers({
    auth: authReducer,
    events: eventsReducer,
    groups: groupsReducer,
});

// Wrap the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer, // Use persistedReducer instead of individual reducers
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
          }),
});

export const persistor = persistStore(store);
