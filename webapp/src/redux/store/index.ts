import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '@redux/reducers/language.reducer';
import uiReducer from '@redux/reducers/ui.reducer';
import orginfoReducer from '@redux/reducers/orginfo.reducer';
import workflowReducer from '@redux/reducers/workflow.reducer';
import missionReducer from '@redux/reducers/mission.reducer';
import integrationReducer from '@redux/reducers/integration.reducer';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    ui: uiReducer,
    orginfo: orginfoReducer,
    workflow: workflowReducer,
    mission: missionReducer,
    integration: integrationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// action types
export const CLEAR_DATA = 'CLEAR_DATA';

// action creator
export const clearData = () => ({
  type: CLEAR_DATA,
});
