function Pinboard({showBoard, content, boardIndex, boardContents, setBoardContents}) { 
    const images = content.map((src, index) => 
        <img src={src} key={index} className="pinboard-image" alt="pinboard-originated"/>
    );

    return (
        <div className="board-container">
            <div style={{display: showBoard ? "flex" : "none"}} className={`board board-index-${boardIndex}`}>
            <p className="label">Current Pinboard: {boardIndex}</p>
            <div className="images">
                {images}
            </div>
            </div>
        </div>
    );
}

export default Pinboard;