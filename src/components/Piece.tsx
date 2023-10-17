import { Image, Box } from "@mantine/core";
import { useAppDispatch } from "src/redux/hooks";
import { gameActions } from "src/redux/gameSlice/gameSlice";

export default function Piece({ color, type, position }: Piece) {
  const dispatch = useAppDispatch();
  return (
    <Box sx={{ width: 45, height: 45 }}>
      <Image src={`/pieces/${color}/${type}.png`} />
    </Box>
  );
}
