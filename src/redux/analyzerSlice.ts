import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "redux/store";

// Define the initial state using that type
const initialState = {
  selectedSquares: [] as string[],
};

export const analyzerSlice = createSlice({
  name: "analyzer",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state.selectedSquares = payload;
    },
    reset: (state) => {
      state.selectedSquares = [];
    },
  },
});

export const analyzerActions = analyzerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAnalyzer = (state: RootState) => state.analyzer;

export default analyzerSlice.reducer;
