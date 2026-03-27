/**
 * @file App.js
 * @author Alejandro Alvarado
 * @brief Tic-Tac-Toe game in the browser
 */

import { useState } from "react";
import { use } from "react/cjs/react.production";

/**
 * Represents an individual square component
 * on the tic-tac-toe board.
 *
 * @param value - an 'X', 'O', or null
 * @param onSquareClick - event handler
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  /**
   * On click, toggle which character should be
   * drawn on the next square/turn, either an 'X' or an 'O'
   * value.
   *
   * @param idx - the idx of the squares and nextSquares arr to read/write
   */
  function handleClick(idx) {
    // if an X or O is present, bail - if someone has won already, bail
    if (squares[idx] || calculateWinner(squares)) {
      return;
    }

    // Copy the data because it makes the time travel feature easier
    const nextSquares = squares.slice();

    nextSquares[idx] = xIsNext ? "X" : "O";

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/** ========== Primary Component ========== */
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // history is acting as a stack
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
/** ========== End Primary Component ========== */

/**
 * Receives the list of squares and their
 * corresponding values to calculate a
 * winner if there is one based off a
 * pre-computed arr of winning positions
 * on the board.
 *
 * @returns {string} - the winning player, 'X', 'O', or null
 */
function calculateWinner(squares) {
  // Hard coded solutions
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Look for a winning combination
  for (let i = 0; i < lines.length; ++i) {
    const [a, b, c] = lines[i]; // destructure the array into three indices to examine into
    // we need the extra squares[a] conditional in case it's null, then we check pairs
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
