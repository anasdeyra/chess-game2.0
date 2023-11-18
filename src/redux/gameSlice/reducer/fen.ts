import { PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { GameState, gameSlice } from "../gameSlice";

export default function fen(
  state: WritableDraft<GameState>,
  { payload }: PayloadAction<string>
) {
  gameSlice.caseReducers.reset(state);
  const [setup, activeColor, castling, enPassant, halfMove, fullMove] =
    payload.split(" ");

  function setupBoard() {
    let currentRank = 8;
    let currentFile = "a";
    const ranks = setup.split("/");

    ranks.forEach((rank) => {
      [...rank].forEach((square) => {
        if (isNaN(Number(square))) {
          let currentSquare: Square = currentFile + currentRank;
          let color: PieceColor =
            square === square.toLowerCase() ? "black" : "white";

          gameSlice.caseReducers.spawn(state, {
            payload: {
              square: currentSquare,
              color,
              // @ts-ignore
              type: square.toLocaleLowerCase(),
            },
            type: "game/spawn",
          });
          return (currentFile = String.fromCharCode(
            currentFile.charCodeAt(0) + 1
          ));
        }

        currentFile = String.fromCharCode(
          currentFile.charCodeAt(0) + Number(square)
        );
      });
      currentRank--;
      currentFile = "a";
    });
  }

  setupBoard();
}
