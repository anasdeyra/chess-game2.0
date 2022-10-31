import { WritableDraft } from "immer/dist/internal";
import { GameState } from "../gameSlice";

export default function reset({ board }: WritableDraft<GameState>) {
  for (let member in board) delete board[member];
}
