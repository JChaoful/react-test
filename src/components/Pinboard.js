function Pinboard({showBoard, content, index, handleDragStart, handleDragEnd, boardContents, setBoardContents}) {
    const handleBoardDragEnd = (e) => {
        handleDragEnd(e);
        if (e.dataTransfer.dropEffect === 'none') {
            const newBoardContents = boardContents;
            const updatedBoard = boardContents[index];
            const deletedIndex = updatedBoard.indexOf(e.target.src);
            updatedBoard.splice(deletedIndex, 1);
            newBoardContents[index] = updatedBoard;
            setBoardContents(newBoardContents);
        }
    }
    
    const images = content.map((src, index) => 
        <img src={src} key={index} className="pinboard-image" alt="pinboard-originated" draggable onDragStart={handleDragStart} onDragEnd={handleBoardDragEnd}/>
    );

    const handleBoardDragOver = (e) => {
        e.preventDefault();
    }

    return (
        <div className="board-container">
            <div style={{display: showBoard ? "flex" : "none"}} className="board" onDragOver={handleBoardDragOver}>
            <p className="label">Current Pinboard: {index}</p>
            <div className="images">
                {images}
            </div>
            </div>
        </div>
    );
}

export default Pinboard;