export {};

declare global {
  type PieceType = "p" | "n" | "b" | "k" | "q" | "r" | string;

  type PieceColor = "black" | "white";

  type BoardRank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  type BoardFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";

  type Square = `${BoardFile}${BoardRank}` | string;

  interface Piece {
    color: PieceColor;
    type: PieceType;
    isPinned: boolean;
    position: Square;
    moves: number;
  }

  type Board = PartialRecord<Square, Piece>;

  interface ChessMove {
    from: Square;
    to: Square;
  }

  interface CastleSides {
    queen: boolean;
    king: boolean;
  }
}
