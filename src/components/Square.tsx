import { Box } from "@mantine/core";
import { ReactNode } from "react";

export default function Square({
  size,
  color,
  children,
}: {
  size: string;
  color: PieceColor;
  children?: ReactNode;
}) {
  const bgColor = color === "black" ? "#533" : "#fff";

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
    >
      {children}
    </Box>
  );
}
