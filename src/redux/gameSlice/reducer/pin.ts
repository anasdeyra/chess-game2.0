import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function pin(
  { board }: WritableDraft<GameState>,
  { payload }: PayloadAction<Square[]>
) {
  for (const square in board) {
    const piece: Piece = board[square];
    piece.isPinned = false;
  }
  payload.forEach((square) => {
    const piece: Piece = board[square];
    piece.isPinned = true;
  });
}
