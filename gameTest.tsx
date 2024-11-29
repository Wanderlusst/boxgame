import React, { useEffect, useRef } from 'react';

function gameTest() {
  const [countDown, setCountDown] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false);
  const [gameStopped, setGameStopped] = React.useState(false);
  const [redBoxPosition, setRedBoxPosition] = React.useState({ top: 0, left: 0 });
  const [moveStartTime, setMoveStartTime] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);
  const [movements, setMovements] = React.useState(0);
  const [clickCount, setClickCount] = React.useState(0);
  const [userGameTime, setUserGameTime] = React.useState(0);

  const timerRef = useRef(null); 
  const countdownRef = useRef(null); 
  const gameBoard = useRef<HTMLDivElement>(null);

  const normalTime = Date.now();

  useEffect(() => {
    if (gameStarted && countDown > 0 && !gameStopped) {
      countdownRef.current = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
      return () => clearInterval(countdownRef.current); 
    }
  }, [countDown, gameStarted, gameStopped]);


  const handleStart = () => {
    setGameStarted(true);
    setGameStopped(false);
    setCountDown(userGameTime); 
    setMoveStartTime(Date.now()); 
  };

  const moveRedBox = () => {
    if (gameBoard.current) {
      const containerWidth = gameBoard.current.offsetWidth;
      const containerHeight = gameBoard.current.offsetHeight;
      const randomX = Math.max(0, Math.random() * (containerWidth - 50));
      const randomY = Math.max(0, Math.random() * (containerHeight - 50));
      setRedBoxPosition({ top: randomY, left: randomX });
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameStopped(false);
    setCountDown(0);
    setMoveStartTime(0);
    setRedBoxPosition({ top: 0, left: 0 });
    setTotalTime(0);
    setMovements(0);
    setClickCount(0);
    setUserGameTime(0);
  };

  const handleRedBoxClick = () => {
    const currentTime = Date.now();
    if (gameStarted) {
      const movementTime = (currentTime - moveStartTime) / 1000;
      setTotalTime((prevTotalTime) => prevTotalTime + movementTime);
      setMovements((prevMovements) => prevMovements + 1);
      setClickCount((prevClickCount) => prevClickCount + 1);
      moveRedBox();
      setMoveStartTime(currentTime);
    }
  };

  const convertTimeToSeconds = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center flex-col">
      <h1 className="text-3xl">Welcome to box hunting game</h1>
      <span>CountDown: {countDown}</span>
      <span>Time: {convertTimeToSeconds(totalTime)}</span>
      <span>Clicks: {clickCount}</span>

      <div className="flex flex-col max-w-xl border border-black">
        <div className="flex flex-row">
          <div className="flex gap-3">
            <button onClick={handleStart} disabled={gameStarted && !gameStopped}>
              Start
            </button>
            <button
              onClick={() => {
                setGameStopped(true);
              }}
              disabled={!gameStarted || gameStopped}
            >
              Stop
            </button>
            <button onClick={resetGame}>Reset</button>
          </div>

          <div>
            <input
              onChange={(e) => setUserGameTime(parseInt(e.target.value))}
              className="border border-black"
              type="number"
              min="1"
              placeholder="Time (seconds)"
            />
          </div>
        </div>

        <div
          ref={gameBoard}
          onClick={handleRedBoxClick}
          className="relative h-[20rem] border border-black"
        >
          <span
            style={{
              position: 'absolute',
              top: redBoxPosition.top,
              left: redBoxPosition.left,
            }}
            onClick={handleRedBoxClick}
          >
            <div className="w-10 h-10 bg-red-500"></div>
          </span>
        </div>

        <div></div>
      </div>
    </div>
  );
}

export default gameTest;
