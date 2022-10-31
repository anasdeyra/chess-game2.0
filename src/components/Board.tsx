import Square from "./Square";
import Piece from "./Piece";
import { ReactNode } from "react";
import { SimpleGrid } from "@mantine/core";

export default function Board({ board }: { board: Board }) {
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const b: ReactNode[] = [];
  let squareColor: PieceColor = "black";

  ranks.forEach((rank) => {
    files.forEach((file) => {
      b.push(
        board[file + rank] ? (
          <Square size={SQUARE_SIZE} color={squareColor}>
            <Piece {...board[file + rank]} />
          </Square>
        ) : (
          <Square size={SQUARE_SIZE} color={squareColor} />
        )
      );
      squareColor === "black"
        ? (squareColor = "white")
        : (squareColor = "black");
    });
    squareColor === "black" ? (squareColor = "white") : (squareColor = "black");
  });
  return (
    <SimpleGrid spacing={0} cols={8}>
      {b}
    </SimpleGrid>
  );
}

const SQUARE_SIZE = "48px";
