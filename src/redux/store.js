// Library imports
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Local imports
import authSlice from './features/auth/authSlice';
import signupSlice from './features/auth/signupSlice';
import membershipSlice from './features/membership/membershipSlice';
import snackbarReducer from './features/snackbarSlice/snackbarSlice';

// Define the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  signup: signupSlice,
  membership: membershipSlice,
  snackbar: snackbarReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Create a persistor
export const persistor = persistStore(store);

