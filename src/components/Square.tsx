import { Box } from "@mantine/core";
import { ReactNode } from "react";
import { useGameManager } from "src/gameManager";
import { selectAnalyzer } from "src/redux/analyzerSlice";
import { useAppSelector } from "src/redux/hooks";
import { selectPlayer } from "src/redux/playerSlice/playerSlice";

export default function Square({
  size,
  color,
  children,
  name,
}: {
  size: string;
  color: PieceColor;
  children?: ReactNode;
  name: string;
}) {
  const { selectedSquare } = useAppSelector(selectPlayer);
  const { selectedSquares } = useAppSelector(selectAnalyzer);
  const bgColor = selectedSquares.includes(name)
    ? "#fee12b"
    : selectedSquare === name
    ? "#ffba00"
    : color === "black"
    ? "#533"
    : "#fff";

  const { onSquareSelect } = useGameManager();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => {
        onSquareSelect(name);
      }}
    >
      {children}
    </Box>
  );
}
