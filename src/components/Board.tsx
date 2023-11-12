import Square from "./Square";
import Piece from "./Piece";
import { ReactNode } from "react";
import { Group, SimpleGrid, Stack } from "@mantine/core";

export default function Board({ board }: { board: Board }) {
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const b: ReactNode[] = [];
  let squareColor: PieceColor = "white";

  ranks.forEach((rank) => {
    files.forEach((file) => {
      b.push(
        board[file + rank] ? (
          <Square
            key={`${file}${rank}`}
            name={`${file}${rank}`}
            size={SQUARE_SIZE}
            color={squareColor}
          >
            <Piece {...board[file + rank]} />
          </Square>
        ) : (
          <Square
            key={`${file}${rank}`}
            name={`${file}${rank}`}
            size={SQUARE_SIZE}
            color={squareColor}
          />
        )
      );
      squareColor === "black"
        ? (squareColor = "white")
        : (squareColor = "black");
    });
    squareColor === "black" ? (squareColor = "white") : (squareColor = "black");
  });
  return (
    <Group align="stretch" spacing={"xs"}>
      <SimpleGrid sx={{ height: 48 * 8 }} spacing={0} cols={1}>
        {ranks.map((r, key) => (
          <div style={{ display: "flex", alignItems: "center" }} key={key}>
            {r}
          </div>
        ))}
      </SimpleGrid>
      <Stack spacing={"xs"}>
        <SimpleGrid spacing={0} cols={8}>
          {b}
        </SimpleGrid>
        <SimpleGrid spacing={0} cols={8}>
          {files.map((f, key) => (
            <div key={key}>{f}</div>
          ))}
        </SimpleGrid>
      </Stack>
    </Group>
  );
}

const SQUARE_SIZE = "48px";
