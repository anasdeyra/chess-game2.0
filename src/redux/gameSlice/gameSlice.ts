import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "redux/store";
import reducers from "./reducers";

// Define a type for the slice state
export interface GameState {
  isGameOVer: boolean;
  isStaleMate: boolean;
  isInsufficientResources: boolean;
  turn: PieceColor;
  check: PieceColor | null;
  mate: PieceColor | null;
  fullMoves: number;
  halfMoves: number;
  castles: Record<PieceColor, CastleSides>;
  board: Board;
  history: string;
}

// Define the initial state using that type
const initialState: GameState = {
  isGameOVer: true,
  isStaleMate: false,
  isInsufficientResources: false,
  turn: "white",
  check: null,
  mate: null,
  fullMoves: 0,
  halfMoves: 0,
  castles: {
    black: { king: true, queen: true },
    white: { king: true, queen: true },
  },
  board: {},
  history: "",
};

export const gameSlice = createSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: reducers,
});

export const gameActions = gameSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectGame = (state: RootState) => state.game;

export default gameSlice.reducer;
