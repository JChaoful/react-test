import "../support/commands";

describe("basic functionality", () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it("can store ONE searched sample image with drag and drop", () => {
    cy.dragAndDrop(".sample-image",".board.board-index-0");
    cy.get(".board.board-index-0 > .images")
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 1);
  })

  it("can store MULTIPLE searched sample images with drag and drop", () => {
    const sampleImage = ".sample-image";
    const board = ".board.board-index-0";
    cy.dragAndDrop(sampleImage, board);
    cy.dragAndDrop(sampleImage, board);
    cy.dragAndDrop(sampleImage, board);
    cy.get(`${board} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 3);
  })  

  it("verify image transparency during drag and drop", () => {
    const sampleImage = ".sample-image";
    const board = ".board.board-index-0";
    const sampleImagedataTransfer = new DataTransfer();
    
    // test transparency of sample image as it is dragged onto pinboard 0
    cy.get(sampleImage).trigger("dragstart", {
      sampleImagedataTransfer
    });

    cy.get(sampleImage)
      .then(($el) => {
        return window.getComputedStyle($el[0]).opacity
      })
      .then(parseInt)
      .should("lessThan", 1);

    cy.get(board).trigger("drop", {
      sampleImagedataTransfer
    });

    cy.get(sampleImage).trigger("dragend", {
      sampleImagedataTransfer
    });

    cy.get(sampleImage)
      .then(($el) => {
        return window.getComputedStyle($el[0]).opacity
      })
      .then(parseInt)
      .should("equal", 1);

    // test transparency of the sample image dragged onto pinboard0 as it is dragged back onto pinboard 0
    const boardZeroSampleImage = 'img[src$="/sample-image.jpg"][class="pinboard-image"]';
    const boardZeroDataTransfer = new DataTransfer();

    cy.get(boardZeroSampleImage).trigger("dragstart", {
      boardZeroDataTransfer
    });

    cy.get(boardZeroSampleImage)
      .then(($el) => {
        return window.getComputedStyle($el[0]).opacity
      })
      .then(parseInt)
      .should("lessThan", 1);

    cy.get(board).trigger("drop", {
      boardZeroDataTransfer
    });

    cy.get(boardZeroSampleImage).trigger("dragend", {
      boardZeroDataTransfer
    });

    cy.get(boardZeroSampleImage)
      .then(($el) => {
        return window.getComputedStyle($el[0]).opacity
      })
      .then(parseInt)
      .should("equal", 1);
    })

    it("verify pinboard images are removed when dropped out of the pinboard", () => {
      // test if there are no images on the pinboard after dragging out the initial image
      cy.dragAndDrop('img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]',".searched-images");
      cy.get(".board.board-index-0 > .images")
      .children({timeout: 300})
      .should("have.length", 0);

      // test if there are no images on the pinboard after dragging in the sample image and then dragging it out again
      cy.dragAndDrop(".sample-image",".board.board-index-0");
      cy.get(".board.board-index-0 > .images")
        .children('img[src$="/sample-image.jpg"]', {timeout: 300})
        .should("have.length", 1);

      cy.dragAndDrop('img[src$="/sample-image.jpg"][class="pinboard-image"]', ".searched-images");
      cy.get(".board.board-index-0 > .images")
        .children({timeout: 300})
        .should("have.length", 0);
    })
})

// Pinboard data storage tests/arrow functionality
// check arrow changes on dragover
// check whether boards save moved content
// check ability to drag sample image to different boards 
// check ability to remove image from different boards
// test transfer of image from one pinboard to another (middle one)  (removes image from original, stores in other pinboard)

// test transfer of image from one pinboard to another while moving out of the board boundary

describe ("Data storage integrity tests", () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it("check pinboard change after dragging over arrow", () => {
    const sampleImage = ".sample-image";
    const leftChevron = ".fa-chevron-left";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";
    const board2 = ".board.board-index-2";
    const sampleImagedataTransfer = new DataTransfer()
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(board2).should('be.not.visible');
    cy.get(sampleImage).trigger("dragstart", {
      sampleImagedataTransfer
    });

    for (var i = 0; i < 10; i++) {
      cy.get(rightChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');
    cy.get(board2).should('be.not.visible');

    for (var i = 0; i < 10; i++) {
      cy.get(leftChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }

    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(board2).should('be.not.visible');
  })

  it("check whether images are saved moving between pinboards", () => {
    const sampleImage = ".sample-image";
    const leftChevron = ".fa-chevron-left";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";

    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.dragAndDrop(sampleImage,board0);
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board0} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 1);
    cy.get(rightChevron).click();
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');
    cy.get(leftChevron).click();
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board0} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 1);
  })

  it("check ability to drag the searched sample image to a different pinboard", () => {
    const sampleImage = ".sample-image";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";
    const sampleImagedataTransfer = new DataTransfer()
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(sampleImage).trigger("dragstart", {
      sampleImagedataTransfer
    });

    for (var i = 0; i < 10; i++) {
      cy.get(rightChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');

    cy.get(board1).trigger("drop", {
      sampleImagedataTransfer
    });

    cy.get(sampleImage).trigger("dragend", {
      sampleImagedataTransfer
    });

    cy.get(`${board1} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board1} > .images`)
    .children('img[src$="/sample-image.jpg"]', {timeout: 300})
    .should("have.length", 1);
  })

  it("check whether images can be removed from a pinboard after switching pinboards", () => {
    const sampleImage = ".sample-image";
    const droppedSampleImage = 'img[src$="/sample-image.jpg"][class="pinboard-image"]';
    const leftChevron = ".fa-chevron-left";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";
    const sampleImagedataTransfer = new DataTransfer()

    // Drop searched sample image into pinboard 0 
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.dragAndDrop(sampleImage,board0);
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board0} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 1);

    // Drag searched sample image to pinboard 1 and try to remove by dropping outside of pinboard 1
    cy.get(droppedSampleImage).trigger("dragstart", {
      sampleImagedataTransfer
    });

    for (var i = 0; i < 10; i++) {
      cy.get(rightChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');

    cy.get(sampleImage).trigger("drop", {
      sampleImagedataTransfer
    });

    cy.get(droppedSampleImage).trigger("dragend", {
      sampleImagedataTransfer,
      force: true
    });

    cy.get(`${board1} > .images`)
      .children({timeout: 300})
      .should("have.length", 1);
    cy.get(`${board1} > .images`)
    .children('img[src$="/sample-image.jpg"]', {timeout: 300})
    .should("have.length", 0);

    // Check if pinboard 0 no longer has sample image
    cy.get(leftChevron).click();
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 1);
    cy.get(`${board0} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 0);
  })

  it("check whether images can be moved from one pinboard to another", () => {
    const sampleImage = 'img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]';
    const leftChevron = ".fa-chevron-left";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";
    const sampleImagedataTransfer = new DataTransfer()

    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(`${board0} > .images`)
    .children({timeout: 300})
    .should("have.length", 1);

    // Drag sample image from pinboard 0 and try to move it to pinboard 1
    cy.get(sampleImage).trigger("dragstart", {
      sampleImagedataTransfer
    });

    for (var i = 0; i < 10; i++) {
      cy.get(rightChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');

    cy.get(board1).trigger("drop", {
      sampleImagedataTransfer
    });

    cy.get(sampleImage).trigger("dragend", {
      sampleImagedataTransfer,
      force: true
    });

    cy.get(`${board1} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board1} > .images`)
      .children('img[src$="/pinboard-0-initial-image.jpg"]', {timeout: 300})
      .should("have.length", 1);
    cy.get(`${board1} > .images`)
      .children('img[src$="/pinboard-1-initial-image.jpg"]', {timeout: 300})
      .should("have.length", 1);

    // Check if pinboard 0 no longer has sample image
    cy.get(leftChevron).click();
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 0);
  })

  it("check whether images can be transferred from one pinboard to another while moving out of the board", () => {
    const sampleImage = ".sample-image";
    const sampleImageBoardZero = 'img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]';
    const leftChevron = ".fa-chevron-left";
    const rightChevron = ".fa-chevron-right";
    const board0 = ".board.board-index-0";
    const board1 = ".board.board-index-1";
    const sampleImagedataTransfer = new DataTransfer()

    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(`${board0} > .images`)
    .children({timeout: 300})
    .should("have.length", 1);

    // Drag sample image from pinboard 0 and try to move it to pinboard 1, dragging it out of bounds alon gthe way
    cy.get(sampleImageBoardZero).trigger("dragstart", {
      sampleImagedataTransfer
    });

    for (var i = 0; i < 10; i++) {
      cy.get(rightChevron).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    
    cy.get(board0).should('be.not.visible');
    cy.get(board1).should('be.visible');

    for (var i = 0; i < 2; i++) {
      cy.get(sampleImage).trigger("dragover", {
        sampleImagedataTransfer
      });
      cy.wait(100);
    }
    cy.get(board1).trigger("drop", {
      sampleImagedataTransfer
    });

    cy.get(sampleImageBoardZero).trigger("dragend", {
      sampleImagedataTransfer,
      force: true
    });

    cy.get(`${board1} > .images`)
      .children({timeout: 300})
      .should("have.length", 2);
    cy.get(`${board1} > .images`)
      .children('img[src$="/pinboard-0-initial-image.jpg"]', {timeout: 300})
      .should("have.length", 1);
    cy.get(`${board1} > .images`)
      .children('img[src$="/pinboard-1-initial-image.jpg"]', {timeout: 300})
      .should("have.length", 1);

    // Check if pinboard 0 no longer has sample image
    cy.get(leftChevron).click();
    cy.get(board0).should('be.visible');
    cy.get(board1).should('be.not.visible');
    cy.get(`${board0} > .images`)
      .children({timeout: 300})
      .should("have.length", 0);
  })
})


describe ("edge cases", () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it("check for handling dragging of non-image elements", () => {
    cy.dragAndDrop("footer > p",".board.board-index-0");
    cy.get(".board.board-index-0 > .images")
      .children({timeout: 300})
      .should("have.length", 1);
  })

  it("check for handling dragging a pinboard image onto itself", () => {
        // test if there is still one image on the pinboard after dragging the initial image onto itself
        // and test that that one image is the same initial image
        cy.dragAndDrop('img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]','img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]');
        cy.get(".board.board-index-0 > .images")
        .children({timeout: 300})
        .should("have.length", 1);
        cy.get(".board.board-index-0 > .images")
        .children('img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]', {timeout: 300})
        .should("have.length", 1);
  
        // test if there are two images on the pinboard after dragging the sample image onto the pinboard
        // and test that that the images on the pinboard stay the same after dragging the pinboard's copy of the sample image
        // onto the initial image
        cy.dragAndDrop(".sample-image",".board.board-index-0");
        cy.get(".board.board-index-0 > .images")
          .children({timeout: 300})
          .should("have.length", 2);
        cy.get(".board.board-index-0 > .images")
          .children('img[src$="/sample-image.jpg"]', {timeout: 300})
          .should("have.length", 1);
  
        cy.dragAndDrop('img[src$="/sample-image.jpg"][class="pinboard-image"]', 'img[src$="/pinboard-0-initial-image.jpg"][class="pinboard-image"]');
        cy.get(".board.board-index-0 > .images")
          .children({timeout: 300})
          .should("have.length", 2);
        cy.get(".board.board-index-0 > .images")
          .children('img[src$="/pinboard-0-initial-image.jpg"]', {timeout: 300})
          .should("have.length", 1);
          cy.get(".board.board-index-0 > .images")
          .children('img[src$="/sample-image.jpg"]', {timeout: 300})
          .should("have.length", 1);
  })

  it("check for handling drag and dropping the searched sample image outside the pinboard", () => {
    cy.dragAndDrop(".sample-image",".sample-image");
    cy.get(".board.board-index-0 > .images")
      .children({timeout: 300})
      .should("have.length", 1);
    cy.get(".board.board-index-0 > .images")
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", 0);
  })

  it("can store A LOT OF searched sample images with drag and drop", () => {
    const sampleImage = ".sample-image";
    const board = ".board.board-index-0";
    const NUMIMAGES = 40;
    for (var i = 0; i < NUMIMAGES; ++i) {
      const dataTransfer = new DataTransfer();

      cy.get(sampleImage).trigger("dragstart", {
        dataTransfer
      });
    
      cy.get(board).trigger("drop", {
        dataTransfer,
        force: true
      });
    
      cy.get(sampleImage).trigger("dragend", {
        dataTransfer
      });
    }
    cy.get(`${board} > .images`)
    .children({timeout: 300})
    .should("have.length", NUMIMAGES+1);
    cy.get(`${board} > .images`)
      .children('img[src$="/sample-image.jpg"]', {timeout: 300})
      .should("have.length", NUMIMAGES);
  })  
}) 


