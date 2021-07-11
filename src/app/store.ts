import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import activeReducer from '../features/activeSlice'; 
export const store = configureStore({
  reducer: {
    active: activeReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
