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
    cy.dragAndDrop(".sample-image",".board.board-index-0");
    cy.dragAndDrop(".sample-image",".board.board-index-0");
    cy.dragAndDrop(".sample-image",".board.board-index-0");
    cy.get(".board.board-index-0 > .images")
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
}) 


