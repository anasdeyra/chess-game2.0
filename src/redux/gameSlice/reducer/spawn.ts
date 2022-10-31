import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function spawn(
  { board }: WritableDraft<GameState>,
  { payload: { square, type, color } }: PayloadSpawn
) {
  board[square] = { color, type, position: square, isPinned: false, moves: 0 };
}

type PayloadSpawn = PayloadAction<{
  square: Square;
  type: PieceType;
  color: PieceColor;
}>;
