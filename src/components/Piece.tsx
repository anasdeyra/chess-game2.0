import { Image, Box } from "@mantine/core";
import { useAppDispatch } from "src/redux/hooks";
import { gameActions } from "src/redux/gameSlice/gameSlice";

export default function Piece({ color, type, position }: Piece) {
  const dispatch = useAppDispatch();
  return (
    <Box
      onClick={() => {
        dispatch(gameActions.move({ from: position, to: "e4" }));
      }}
      sx={{ width: 45, height: 45 }}
    >
      <Image src={`/pieces/${color}/${type}.png`} />
    </Box>
  );
}
