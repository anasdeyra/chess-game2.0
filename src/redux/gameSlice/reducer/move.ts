import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function move(
  { board, fullMoves, turn }: WritableDraft<GameState>,
  { payload: { from, to } }: PayloadAction<ChessMove>
) {
  const piece = board[from];
  if (!board[from] || turn !== piece.color || to === from) return;

  board[to] = board[from];
  delete board[from];

  piece.moves++;
  if (turn === "black") {
    fullMoves++;
    turn = "white";
  } else turn = "black";
}
