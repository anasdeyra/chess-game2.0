export function calcLegalMoves(board: Board, square: Square) {
  const piece: Piece | undefined = board[square];
  if (!piece) return [];

  let moves: string[] = [];
  if (piece.type === "k") moves = calcKingLegalMoves(board, square);
  else moves = getDefaultMoves(board, square);

  if (piece.isPinned) {
    const pinnerPosition = getPinner(board, square);
    const lineOfSight = getLineOfSight(
      board,
      pinnerPosition!,
      getKingPosition(board, piece.color)
    );
    moves = moves.filter(
      (sq) => lineOfSight.includes(sq) || sq === pinnerPosition
    );
  }
  if (isKingChecked(board, piece.color)) {
    const legalMoves = moves.filter((move) => {
      const possibleBoard = { ...board };
      possibleBoard[move] = possibleBoard[square];
      delete possibleBoard[square];
      return !isKingChecked(possibleBoard, piece.color);
    });

    moves = moves.filter((m) => legalMoves.includes(m));
  }
  return moves;
}

export function getDefaultMoves(board: Board, square: Square) {
  const piece: Piece | undefined = board[square];
  if (!piece) return [];

  let moves: string[] = [];

  switch (piece.type) {
    case "k":
      moves = getKingDefaultMoves(board, square);
      break;
    case "p":
      moves = getPawnDefaultMoves(board, square);
      break;
    case "n":
      moves = getKnightDefaultMoves(board, square);
      break;
    default:
      moves = getPieceDefaultMoves(board, square);
      break;
  }
  return moves;
}

export function getKingDefaultMoves(board: Board, position: Square) {
  const king: Piece = board[position];
  const moves: Square[] = [];

  // get all Moves that the piece can move assuming the board is empty
  OFFSETS.king.forEach(([file, rank]) => {
    let calculatedSquare = calcSquare(position, { file, rank });
    if (calculatedSquare) moves.push(calculatedSquare);
  });

  // exclude squares with same color pieces in them or attacked by enemies

  return moves.filter((sq) => !board[sq] || board[sq].color !== king.color);
}

function calcKingLegalMoves(board: Board, position: Square) {
  const king: Piece = board[position];
  const moves: Square[] = getKingDefaultMoves(board, position);

  // remove squares attacked by enemies
  const color = king.color === "black" ? "white" : "black";
  const attackedSquares = getAttackedSquares(board, color);

  return moves.filter((sq) => !attackedSquares.includes(sq));
}

function getPawnDefaultMoves(board: Board, position: Square) {
  const pawn: Piece = board[position];
  let moves: Square[] = [];
  const offset = pawn.color === "white" ? 1 : -1;

  //marsh 1 square
  moves.push(calcSquare(position, { file: 0, rank: offset * 1 })!);

  //marsh 2 squares if first move
  if (pawn.moves === 0)
    moves.push(calcSquare(position, { file: 0, rank: offset * 2 })!);

  // exclude squares with pieces in them
  moves = [...moves.filter((sq) => !board[sq])];

  // add capture moves if available
  const captureSquares = [
    calcSquare(position, { file: 1, rank: offset }),
    calcSquare(position, { file: -1, rank: offset }),
  ];

  captureSquares.forEach((square) => {
    if (square && board[square] && board[square].color !== pawn.color)
      moves.push(square);
  });

  //enpassante

  return moves;
}

function getKnightDefaultMoves(board: Board, position: Square) {
  const knight: Piece = board[position];
  const moves: Square[] = [];

  // get all Moves that the piece can move assuming the board is empty
  OFFSETS.knight.forEach(([file, rank]) => {
    let calculatedSquare = calcSquare(position, { file, rank });
    if (calculatedSquare && squareExists(calculatedSquare))
      moves.push(calculatedSquare);
  });

  // exclude squares with same color pieces in them

  return moves.filter((sq) => !board[sq] || board[sq].color !== knight.color);
}

function getPieceDefaultMoves(board: Board, position: Square) {
  const piece: Piece = board[position];
  const moves: Square[] = [];

  let pieceType: "queen" | "bishop" | "rook";

  switch (piece.type) {
    case "q":
      pieceType = "queen";
      break;
    case "r":
      pieceType = "rook";
      break;
    case "b":
      pieceType = "bishop";
      break;
    default:
      return [];
  }

  OFFSETS[pieceType].forEach((offset) => {
    //squares counter in current direction
    let index = 1;

    //destination square
    let square = calcSquare(position, {
      file: offset[0] * index,
      rank: offset[1] * index,
    });

    //loop while destination square is a valid square and the piece does not colide with another piece
    try {
      while (square) {
        const _piece: Piece | undefined = board[square];

        if (_piece) {
          if (_piece.color !== piece.color) moves.push(square);
          throw "a";
        }

        moves.push(square);
        index++;
        square = calcSquare(position, {
          file: offset[0] * index,
          rank: offset[1] * index,
        });
      }
    } catch {}
  });
  return moves;
}

export function squaremoveCords(square: Square) {
  return { file: square.charCodeAt(0) - 96, rank: Number(square[1]) };
}

export function cordsmoveSquare(cords: { file: number; rank: number }) {
  return `${String.fromCharCode(cords.file + 96)}${cords.rank}`;
}

export function squareExists(square: Square) {
  if (square.length !== 2) return false;
  const cords = squaremoveCords(square);

  if (cords.file > 8 || cords.file < 1 || cords.rank > 8 || cords.rank < 1)
    return false;
  return true;
}

export function calcSquare(
  square: Square,
  steps: { file: number; rank: number }
) {
  const cords = squaremoveCords(square);
  const newCords = {
    file: cords.file + steps.file,
    rank: cords.rank + steps.rank,
  };
  const calculatedSquare = cordsmoveSquare(newCords);
  if (!squareExists(calculatedSquare)) return null;
  return calculatedSquare;
}

export function getAttackedSquares(board: Board, color: PieceColor) {
  const squares: Square[] = [];
  for (const square in board) {
    const piece: Piece = board[square];
    if (piece.color === color) squares.push(...getDefaultMoves(board, square));
  }
  return squares;
}

export function getKingPosition(board: Board, color: PieceColor) {
  let pos: string;
  for (const square in board) {
    const piece: Piece = board[square];
    if (piece.type === "k" && piece.color === color) pos = square;
  }
  return pos!;
}

export function isKingChecked(board: Board, color: PieceColor) {
  const _color: PieceColor = color === "black" ? "white" : "black";
  const kingPosition = getKingPosition(board, color);

  const attackedSquares = getAttackedSquares(board, _color);

  return attackedSquares.includes(kingPosition);
}

export function getLineOfSight(
  board: Board,
  attackerPosition: Square,
  targetSquare: Square
) {
  const squares: string[] = [];
  const piece: Piece = board[attackerPosition];
  if (!piece) return [];

  let pieceType: "queen" | "bishop" | "rook";

  switch (piece.type) {
    case "q":
      pieceType = "queen";
      break;
    case "r":
      pieceType = "rook";
      break;
    case "b":
      pieceType = "bishop";
      break;
    default:
      return [];
  }

  OFFSETS[pieceType].every((offset) => {
    //squares counter in current direction
    let index = 1;

    //destination square
    let square = calcSquare(attackerPosition, {
      file: offset[0] * index,
      rank: offset[1] * index,
    });

    const _squares: Square[] = [];
    let found = false;

    //loop while destination square is a valid square and the piece does not colide with another piece
    try {
      while (square) {
        const detectedPiece: Piece | undefined = board[square];
        /*
        missing pinning logic
        */
        if (detectedPiece) {
          if (detectedPiece.color === piece.color) throw "a";
          if (square === targetSquare) {
            found = true;
            throw "a";
          }
        }

        _squares.push(square);
        index++;
        square = calcSquare(attackerPosition, {
          file: offset[0] * index,
          rank: offset[1] * index,
        });
      }
    } catch {}
    if (found) {
      squares.push(..._squares);
      return false;
    }
    return true;
  });

  return squares;
}

export function getPiecesBetween(
  board: Board,
  attackerPosition: Square,
  targetSquare: Square
) {
  const squares = getLineOfSight(board, attackerPosition, targetSquare);
  const pieces = squares
    .filter((square) => !!board[square])
    .map((square) => board[square]);
  return pieces;
}

export function isPiecePinned(board: Board, position: Square) {
  const piece: Piece = board[position];
  if (piece.type == "k") return false;

  let isPinned = false;

  for (const square in board) {
    const sqPiece = board[square];
    if (sqPiece.color !== piece.color) {
      const inBetween = getPiecesBetween(
        board,
        square,
        getKingPosition(board, piece.color)
      );

      if (inBetween.length === 1 && inBetween[0] === piece) isPinned = true;
    }
  }

  return isPinned;
}

export function getPinner(board: Board, position: Square) {
  const piece: Piece = board[position];

  let pinner = null;

  for (const square in board) {
    const sqPiece = board[square];
    if (sqPiece.color !== piece.color) {
      const inBetween = getPiecesBetween(
        board,
        square,
        getKingPosition(board, piece.color)
      );

      if (inBetween.length === 1) pinner = square;
    }
  }

  return pinner;
}

export function getAllPinnedPieces(board: Board) {
  const pinnedPieces: string[] = [];

  for (const square in board) {
    if (isPiecePinned(board, square)) pinnedPieces.push(square);
  }
  return pinnedPieces;
}

export const OFFSETS = {
  rook: [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ],
  bishop: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ],
  knight: [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ],
  queen: [
    [1, 1],
    [1, -1],
    [1, 0],
    [-1, 1],
    [-1, -1],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
  king: [
    [1, 0],
    [1, 1],
    [0, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [0, -1],
    [-1, 0],
  ],
};

export function getPlayerLegalMoves(board: Board, color: PieceColor) {
  const moves: string[] = [];
  for (const square in board) {
    const piece: Piece = board[square];
    if (piece.color === color) moves.push(...calcLegalMoves(board, square));
  }
  return moves;
}
