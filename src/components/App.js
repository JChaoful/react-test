import '../css/App.css';
import Pinboard from './Pinboard';
import { useState } from 'react';

function App() {
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boardsDisplayed, setBoardsDisplayed] = useState([true, false, false]);
  const [boardContents, setBoardContents] = useState([["/pinboard-0-initial-image.jpg"],["/pinboard-1-initial-image.jpg"],["/pinboard-2-initial-image.jpg"]]);
  const [dragOverTimer, setDragOverTimer] = useState(0);
  const [dragTarget, setDragTarget] = useState(null);

  const DRAGOVER_SWITCH_DELAY = 1000;

  function openBoard(index) {
    const newBoardsDisplayed = new Array(boardsDisplayed.length).fill(false);
    newBoardsDisplayed[index] = true;
    setBoardsDisplayed(newBoardsDisplayed);
    setCurrentBoard(index);
  }

  const handleDragStart = (e) => {
    e.target.style.opacity=0.75;
    setDragTarget(e.target);
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity=1.0;
    setDragTarget(null);
  }

  const handleLeftClick = () => {
    const prevBoardIndex = Math.max(0, currentBoard - 1);
    openBoard(prevBoardIndex);
  }

  const handleLeftDragOver = () => {
    if (dragOverTimer === 0) {
      setDragOverTimer(Date.now());
    } else if (Date.now() - dragOverTimer > DRAGOVER_SWITCH_DELAY) {
      setDragOverTimer(Date.now() - 100);
      const prevBoardIndex = Math.max(0, currentBoard - 1);
      openBoard(prevBoardIndex);
    }
  }

  const handleRightClick = () => {
    const nextBoardIndex = Math.min(boardsDisplayed.length - 1, currentBoard + 1);
    openBoard(nextBoardIndex);
  }

  const handleRightDragOver = () => {
    if (dragOverTimer === 0) {
      setDragOverTimer(Date.now());
    } else if (Date.now() - dragOverTimer > DRAGOVER_SWITCH_DELAY) {
      setDragOverTimer(Date.now() -  100);
      const nextBoardIndex = Math.min(boardsDisplayed.length - 1, currentBoard + 1);
      openBoard(nextBoardIndex);
    }
  }

  const handleArrowDragleave = () => {
    setDragOverTimer(0);
  }

  const handleBoardDrop = (e) => {
    if (dragTarget !== null) {
      const newBoardContents = boardContents;
      const updatedBoard = boardContents[currentBoard];
      updatedBoard.push(dragTarget.src);
      newBoardContents[currentBoard] = updatedBoard;
      setBoardContents(newBoardContents);
    }
  }

  return (
    <div className="App">
      <h1>Pinboard App</h1>
      <div className="searched-images">
        <p className="label">Searched Images: </p>
        <img src="/sample-image.jpg" className="sample-image" alt="cat from search result" draggable onDragStart={handleDragStart} onDragEnd={handleDragEnd}/>
      </div>
      <div className="pinboard-carousel" onDrop={handleBoardDrop}>
        <i className="fa-solid fa-chevron-left chevron" onClick={handleLeftClick} onDragOver={handleLeftDragOver} onDragLeave={handleArrowDragleave}/>
        {
        boardsDisplayed.map((showBoard, index) => 
          <Pinboard showBoard={showBoard} content={boardContents[index]} boardIndex={index} key={index} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} boardContents={boardContents} setBoardContents={setBoardContents}/>)}
        <i className="fa-solid fa-chevron-right chevron" onClick={handleRightClick} onDragOver={handleRightDragOver} onDragLeave={handleArrowDragleave}/>
      </div>
      <footer>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </footer>
    </div>
  );
}

export default App;
