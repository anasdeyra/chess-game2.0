import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function move(
  state: WritableDraft<GameState>,
  { payload: { from, to } }: PayloadAction<ChessMove>
) {
  const piece = state.board[from];
  if (!state.board[from] || state.turn !== piece.color || to === from) return;

  state.board[to] = state.board[from];
  delete state.board[from];
  state.board[to].position = to;

  piece.moves++;
  state.enPassente = null;
}
