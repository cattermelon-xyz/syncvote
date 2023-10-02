import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  language: 'en',
};

const languageReducer = createReducer(initialState, () => {});

export default languageReducer;
