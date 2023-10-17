import { gameActions, selectGame } from "./redux/gameSlice/gameSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { selectPlayer } from "./redux/playerSlice/playerSlice";
import {
  calcLegalMoves,
  getAllPinnedPieces,
  getPlayerLegalMoves,
  isKingChecked,
  squareExists,
} from "./utils";
import { playerActions } from "./redux/playerSlice/playerSlice";
import { useEffect, useState } from "react";
import { analyzerActions } from "./redux/analyzerSlice";

export function useGameManager() {
  const game = useAppSelector(selectGame);
  window.board = game.board;
  const { selectedSquare } = useAppSelector(selectPlayer);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameIsOver, setGameIsOver] = useState(false);

  const dispatch = useAppDispatch();

  const moveSelectedPieceTo = (square: string) => {
    const legalMoves = calcLegalMoves(game.board, selectedSquare!);

    if (!legalMoves.includes(square)) return;

    //move comands
    dispatch(gameActions.move({ from: selectedSquare!, to: square }));
    dispatch(playerActions.reset());
    dispatch(analyzerActions.reset());
    dispatch(gameActions.switchTurns());

    const _board = { ...game.board };
    _board[square] = _board[selectedSquare!];
    delete _board[selectedSquare!];
    //checks
    const turn = game.turn === "black" ? "white" : "black";
    if (isKingChecked(_board, turn)) {
      dispatch(gameActions.check(turn));

      const legalMoves = getPlayerLegalMoves(_board, turn);

      if (legalMoves.length === 0) setGameIsOver(true);
    } else dispatch(gameActions.unCheck());
    //pins
    const pinnedPieces = getAllPinnedPieces(_board);
    dispatch(gameActions.pin(pinnedPieces));
  };

  const unSelectPiece = () => {
    dispatch(playerActions.reset());
    dispatch(analyzerActions.reset());
  };

  const selectPiece = (square: string) => {
    dispatch(playerActions.selectSquare(square));
    //visual debug
    dispatch(analyzerActions.set(calcLegalMoves(game.board, square!)));
  };

  const onSquareSelect = (square: string) => {
    const clickedPiece: Piece = game.board[square];
    const selectedPiece: Piece = game.board[selectedSquare];

    if (!squareExists(square)) return;

    /* STATE = UNSELCTED */

    // select square if its the right turn
    if (!selectedSquare && clickedPiece?.color === game.turn) {
      selectPiece(square);
    }

    // not colors turn
    if (!selectedSquare && clickedPiece?.color !== game.turn) {
      return;
    }

    /* STATE = SELCTED */

    // unselect square if clicked on the already selected piece
    else if (selectedSquare === square) {
      unSelectPiece();
    }

    // change selection if clicked on ally piece
    else if (clickedPiece?.color === game.turn) {
      selectPiece(square);
    }

    //execute action
    else {
      moveSelectedPieceTo(square);
    }
  };

  const startGame = () => {
    dispatch(
      gameActions.fen(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      )
    );
    setGameStarted(true);
  };

  return {
    startGame,
    onSquareSelect,
    gameStarted,
    gameState: game,
  };
}
