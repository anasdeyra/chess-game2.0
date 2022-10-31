import "./App.css";
import Board from "./components/Board";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { Container, Button } from "@mantine/core";
import { gameActions } from "./redux/gameSlice/gameSlice";

function App() {
  const board = useAppSelector((state) => state.game.board);
  const dispatch = useAppDispatch();

  return (
    <Container>
      <Board board={board}></Board>
      <Button
        onClick={() => {
          dispatch(
            gameActions.fen(
              "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            )
          );
        }}
        mt={48}
        size="xl"
        color={"lime"}
      >
        Start
      </Button>
    </Container>
  );
}

export default App;
