import '../css/App.css';
import Pinboard from './Pinboard';
import { useState } from 'react';

function App() {
  const [currentBoard, setCurrentBoard] = useState(0);
  const [boardsDisplayed, setBoardsDisplayed] = useState([true, false, false]);
  const [boardContents, setBoardContents] = useState([["/pinboard-0-initial-image.jpg"],["/pinboard-1-initial-image.jpg"],["/pinboard-2-initial-image.jpg"]]);


  function openBoard(index) {
    const newBoardsDisplayed = new Array(boardsDisplayed.length).fill(false);
    newBoardsDisplayed[index] = true;
    setBoardsDisplayed(newBoardsDisplayed);
    setCurrentBoard(index);
  }


  const handleLeftClick = () => {
    const prevBoardIndex = Math.max(0, currentBoard - 1);
    openBoard(prevBoardIndex);
  }


  const handleRightClick = () => {
    const nextBoardIndex = Math.min(boardsDisplayed.length - 1, currentBoard + 1);
    openBoard(nextBoardIndex);
  }

  return (
    <div className="App">
      <h1>Pinboard App</h1>
      <div className="searched-images">
        <p className="label">Searched Images: </p>
        <img src="/sample-image.jpg" className="sample-image" alt="cat from search result"/>
      </div>
      <div className="pinboard-carousel">
        <i className="fa-solid fa-chevron-left chevron" onClick={handleLeftClick}/>
        {
        boardsDisplayed.map((showBoard, index) => 
          <Pinboard showBoard={showBoard} content={boardContents[index]} boardIndex={index} key={index} boardContents={boardContents} setBoardContents={setBoardContents}/>)}
        <i className="fa-solid fa-chevron-right chevron" onClick={handleRightClick}/>
      </div>
      <footer>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </footer>
    </div>
  );
}

export default App;
