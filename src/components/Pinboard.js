function Pinboard({showBoard, content, boardIndex, handleDragStart, handleDragEnd, boardContents, setBoardContents}) {
    const handleBoardDragEnd = (e) => {
        handleDragEnd(e);
        const newBoardContents = boardContents;
        const updatedBoard = boardContents[boardIndex];
        const deletedIndex = updatedBoard.indexOf(e.target.src);
        updatedBoard.splice(deletedIndex, 1);
        newBoardContents[boardIndex] = updatedBoard;
        setBoardContents(newBoardContents);
    }
    
    const images = content.map((src, index) => 
        <img src={src} key={index} className="pinboard-image" alt="pinboard-originated" draggable onDragStart={handleDragStart} onDragEnd={handleBoardDragEnd}/>
    );

    const handleBoardDragOver = (e) => {
        e.preventDefault();
    }

    return (
        <div className="board-container">
            <div style={{display: showBoard ? "flex" : "none"}} className={`board board-index-${boardIndex}`} onDragOver={handleBoardDragOver}>
            <p className="label">Current Pinboard: {boardIndex}</p>
            <div className="images">
                {images}
            </div>
            </div>
        </div>
    );
}

export default Pinboard;