import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice'; // Import the chatSlice reducer
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer, // Add chatSlice reducer
    [apiSlice.reducerPath]: apiSlice.reducer, // Add the RTK Query reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add RTK Query middleware
});
