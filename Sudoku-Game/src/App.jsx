import React, { useState } from "react";
import { LuLoader } from "react-icons/lu";
import Confetti from "react-confetti";

function App() {
  const [initialBoard, setInitialBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [latestGameState, setLatestGameState] = useState([]);
  const [loading, setloading] = useState(false);
  const [check, setCheck] = useState(false);
  const [victory, setVictory] = useState(false);

  const fetchSodukuBoard = async () => {
    setloading(true);
    setCheck(false);
    setVictory(false);
    const response = await fetch(
      "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution}}}"
    );
    const data = await response.json();

    setInitialBoard(data.newboard.grids[0].value);
    setLatestGameState(data.newboard.grids[0].value);
    setSolution(data.newboard.grids[0].solution);
    setloading(false);
  };

  const playMove = (rowI, columnI, value) => {
    setLatestGameState((prevState) => {
      const updatedGameState = prevState.map((row) => [...row]);

      if (initialBoard[rowI][columnI] === 0) {
        updatedGameState[rowI][columnI] =
          value === "" ? 0 : parseInt(value, 10) || 0;
      }

      return updatedGameState;
    });
  };

  const checkSolution = () => {
    setCheck(!check);
    const areArraysEqual = () => {
      return JSON.stringify(solution) === JSON.stringify(latestGameState);
    };

    const result = areArraysEqual();

    result && setVictory(true);
  };

  console.log(solution);

  return (
    <div className="text-3xl flex  items-center flex-col gap-9 p-6 bg-black h-dvh ">
      <div className="text-gray-100">Sudoku Game</div>
      {victory && (
        <div>
          <Confetti />
          <span className="text-green-400 font-semibold">You Win</span>
        </div>
      )}
      {initialBoard.length === 0 && (
        <button onClick={fetchSodukuBoard} className="text-gray-100">
          Play Game
        </button>
      )}
      {loading && (
        <div>
          <LuLoader color="white" className="animate-spin" />
        </div>
      )}
      <div className={`${loading ? "hidden" : "flex flex-col gap-1"}`}>
        {latestGameState.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((column, columnIndex) => {
              const isInitial = initialBoard[rowIndex][columnIndex] !== 0;
              const isCorrect =
                latestGameState[rowIndex][columnIndex] ===
                solution[rowIndex][columnIndex];
              const inputClass = check
                ? isCorrect
                  ? "bg-green-500"
                  : "bg-red-500"
                : isInitial
                ? "bg-gray-500"
                : "bg-white";

              return (
                <input
                  key={`${rowIndex}-${columnIndex}`}
                  type="text"
                  className={`size-8 text-center border p-2 border-black rounded-md ${inputClass}`}
                  value={column === 0 ? "" : column}
                  readOnly={isInitial || check}
                  onChange={(e) =>
                    playMove(rowIndex, columnIndex, e.target.value)
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <div>
        {initialBoard.length > 0 && (
          <div className="flex gap-8">
            <button
              onClick={checkSolution}
              className="bg-green-200 px-4 py-2 rounded-xl text-lg font-semibold"
              hidden={loading}
            >
              {check ? "View Board" : "Check"}
            </button>
            <button
              onClick={fetchSodukuBoard}
              className="bg-green-200 px-4 py-2 rounded-xl text-lg font-semibold"
              hidden={loading}
            >
              New Board
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
