import { gameActions, selectGame } from "./redux/gameSlice/gameSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { selectPlayer } from "./redux/playerSlice/playerSlice";
import {
  calcLegalMoves,
  calcSquare,
  getAllPinnedPieces,
  getAvailableCastles,
  getKingPosition,
  getPlayerLegalMoves,
  getPositionsAfterCastle,
  isKingChecked,
  squareExists,
  squaremoveCords,
} from "./utils";
import { playerActions } from "./redux/playerSlice/playerSlice";
import { useState } from "react";
import { analyzerActions } from "./redux/analyzerSlice";

export function useGameManager() {
  const game = useAppSelector(selectGame);
  // @ts-ignore
  window.board = game.board;
  const { selectedSquare } = useAppSelector(selectPlayer);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameIsOver, setGameIsOver] = useState(false);

  const dispatch = useAppDispatch();

  const afterMoveChecks = (virtualBoard: Board) => {
    dispatch(playerActions.reset());
    dispatch(analyzerActions.reset());
    dispatch(gameActions.switchTurns());

    //checks
    const turn = game.turn === "black" ? "white" : "black";
    if (isKingChecked(virtualBoard, turn)) {
      dispatch(gameActions.check(turn));

      const legalMoves = getPlayerLegalMoves(virtualBoard, turn);

      if (legalMoves.length === 0) setGameIsOver(true);
    } else dispatch(gameActions.unCheck());
    //pins
    const pinnedPieces = getAllPinnedPieces(virtualBoard);
    dispatch(gameActions.pin(pinnedPieces));
  };

  const moveSelectedPieceTo = (square: string) => {

    // check if capturing an enPasente pawn
    const offset = game.turn === "white" ? 1 : -1;
    if (
      game.board[selectedSquare!].type === "p" &&
      game.enPassente &&
      square === calcSquare(game.enPassente, { file: 0, rank: offset })
    )
      dispatch(gameActions.remove(game.enPassente));

    //move comands
    dispatch(gameActions.move({ from: selectedSquare!, to: square }));

    // check if it triggers enPassente
    const oldCords = squaremoveCords(selectedSquare!);
    const newCords = squaremoveCords(square);

    const dif = oldCords.rank - newCords.rank;

    if (game.board[selectedSquare!].type === "p" && (dif === 2 || dif === -2))
      dispatch(gameActions.setEnPassente(square));

    const virtualBoard = { ...game.board };
    virtualBoard[square] = virtualBoard[selectedSquare!];
    delete virtualBoard[selectedSquare!];

    afterMoveChecks(virtualBoard);
  };

  const unSelectPiece = () => {
    dispatch(playerActions.reset());
    dispatch(analyzerActions.reset());
  };

  const selectPiece = (square: string) => {
    dispatch(playerActions.selectSquare(square));
    //visual debug
    dispatch(
      analyzerActions.set(calcLegalMoves(game.board, square!, game.enPassente))
    );
  };

  const handleCastling = (square: string) => {
    const rook = game.board[square!];
    if (rook.moves > 0) return selectPiece(square);
    let side: "king" | "queen" = "king";
    if (square[0] === "a") side = "queen";

    // if (!game.castles[game.turn][side]) return selectPiece(square);

    const availableCastles = getAvailableCastles(game.board, game.turn);

    if (!availableCastles.includes(square)) return selectPiece(square);
    const kingPosition = getKingPosition(game.board, game.turn);
    const newPositions = getPositionsAfterCastle(game.board, square);

    const virtualBoard = { ...game.board };

    //king
    dispatch(
      gameActions.move({ from: kingPosition, to: newPositions.kingPos! })
    );
    virtualBoard[newPositions.kingPos!] = virtualBoard[kingPosition!];
    delete virtualBoard[kingPosition!];

    //rook
    dispatch(gameActions.move({ from: square, to: newPositions.rookPos! }));
    virtualBoard[newPositions.rookPos!] = virtualBoard[square!];
    delete virtualBoard[square!];

    afterMoveChecks(virtualBoard);
  };

  const onSquareSelect = (square: string) => {
    const clickedPiece: Piece = game.board[square];
    const selectedPiece: Piece = game.board[selectedSquare!];

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

    /* STATE = SELECTED */

    // unselect square if clicked on the already selected piece
    else if (selectedSquare === square) {
      unSelectPiece();
    } else if (
      selectedSquare &&
      clickedPiece?.type === "r" &&
      clickedPiece.color === game.turn
    ) {
      handleCastling(square);
    }

    // change selection if clicked on ally piece
    else if (clickedPiece?.color === game.turn) {
      selectPiece(square);
    }

    //execute action
    else {
      const legalMoves = calcLegalMoves(
        game.board,
        selectedSquare!,
        game.enPassente
      );
      if(!legalMoves.includes(square)) return unSelectPiece()
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
