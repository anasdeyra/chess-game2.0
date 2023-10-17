import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "redux/store";

// Define the initial state using that type
const initialState = {
  selectedSquare: null as Square | null,
};

export const playerSlice = createSlice({
  name: "player",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    selectSquare: (state, { payload }) => {
      state.selectedSquare = payload;
    },
    reset: (state) => {
      state.selectedSquare = null;
    },
  },
});

export const playerActions = playerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPlayer = (state: RootState) => state.player;

export default playerSlice.reducer;
