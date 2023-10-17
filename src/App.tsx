import "./App.css";
import Board from "./components/Board";
import { useAppSelector } from "./redux/hooks";
import { Container, Button } from "@mantine/core";
import { useGameManager } from "./gameManager";
import { selectGame } from "./redux/gameSlice/gameSlice";

function App() {
  const { board, turn } = useAppSelector(selectGame);
  const { gameStarted, startGame } = useGameManager();
  return (
    <div>
      <Container>
        <Board board={board} />
        {!gameStarted && (
          <Button onClick={startGame} mt={48} size="xl" color={"lime"}>
            Start
          </Button>
        )}
      </Container>
      turn: {turn}
    </div>
  );
}

export default App;
