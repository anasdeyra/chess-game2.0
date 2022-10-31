import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function remove(
  { board }: WritableDraft<GameState>,
  { payload }: PayloadAction<Square>
) {
  delete board[payload];
}
