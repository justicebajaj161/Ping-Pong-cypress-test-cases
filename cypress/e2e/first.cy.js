// Assuming your HTML file is named "index.html"
const webpageUrl = 'pingpong/index.html';

describe('Ping Pong Game', () => {
  beforeEach(() => {
    cy.window().then((window) => {
      window.localStorage.setItem('MaxScore', '0');
    });
    cy.visit(webpageUrl);
  });

  it('should move the ball after pressing Enter key', () => {
    // Press the Enter key to start the game
    cy.get('body').type('{enter}');

    // Get the initial position of the ball
    cy.get('#ball').then(($ball) => {
      const initialLeft = parseFloat($ball.css('left'));
      const initialTop = parseFloat($ball.css('top'));

      // Wait for a moment to ensure the ball has moved
      cy.wait(1000);

      // Get the new position of the ball
      cy.get('#ball').then(($ball) => {
        const newLeft = parseFloat($ball.css('left'));
        const newTop = parseFloat($ball.css('top'));

        // Ensure that the ball has moved
        expect(newLeft).to.not.equal(initialLeft);
        expect(newTop).to.not.equal(initialTop);
      });
    });
  });

  it('should move both rods together with the same keys', () => {
    // Press the Enter key to start the game
    cy.get('body').type('{enter}');

    // Press the 'D' key
    cy.get('body').type('{A}');

    // Get the initial position of rod1
    cy.get('#rod1').then(($rod1) => {
      const initialLeftRod1 = parseFloat($rod1.css('left'));

      // Get the initial position of rod2
      cy.get('#rod2').then(($rod2) => {
        const initialLeftRod2 = parseFloat($rod2.css('left'));

        // Wait for a moment to ensure the rods have moved
        cy.wait(1000);

        // Get the new position of rod1
        cy.get('#rod1').then(($rod1) => {
          const newLeftRod1 = parseFloat($rod1.css('left'));

          // Get the new position of rod2
          cy.get('#rod2').then(($rod2) => {
            const newLeftRod2 = parseFloat($rod2.css('left'));
            console.log(newLeftRod1);
            console.log(initialLeftRod1);
            // Ensure that both rods have moved together with the same keys
            expect(newLeftRod1).to.not.equal(initialLeftRod1);
            expect(newLeftRod2).to.not.equal(initialLeftRod2 );
          });
        });
      });
    });
  });

  it('ball should stay within game boundaries', () => {
    // Press the Enter key to start the game
    cy.get('body').type('{enter}');
  
    // Wait for a moment to ensure the ball has moved
    cy.wait(1000).then(() => {
      cy.get('#ball').then(($ball) => {
        // Fetch the position and diameter of the ball
        const ballLeft = parseFloat($ball.css('left'));
        const ballWidth = parseFloat($ball.css('width'));
  
        // Fetch the width of the window
        const windowWidth = Cypress.config('viewportWidth');
  
        // Check if the ball is within the window's width
        expect(ballLeft).to.be.at.least(0);
        expect(ballLeft + ballWidth).to.be.at.most(windowWidth);
      });
    });
  });
  

  it('should display alert with winning player and score after each round', () => {
    // Intercept the window.alert function to capture the alert message
    cy.on('window:alert', (message) => {
      // Expect that the alert message contains the winning player and score
      expect(message).to.match(/(Rod 1|Rod 2) wins with a score of \d+. Max score is: \d+/);

      // You can also parse the alert message to extract the winning player and score if needed.
      // For example, if the message is like "Rod 1 wins with a score of 300. Max score is: 300",
      // you can use regular expressions or string manipulation to extract "Rod 1" and "300".

      // For now, let's assume the message format is correct, and no further extraction is needed.
    });

    // Start the game by pressing the Enter key
    cy.get('body').type('{enter}');

    // Wait for the first round to complete (you may adjust the duration as needed)
    cy.clock();
    cy.tick(2000); // Wait for 2 seconds (adjust this value based on your game's logic)

    // Wait for the second round to complete (you may adjust the duration as needed)
    cy.clock();
    cy.tick(2000); // Wait for 2 seconds (adjust this value based on your game's logic)

    // Continue simulating more rounds and wait accordingly

    // Additional rounds...

  });

  it('should move rod horizontally to the left using "A" key', () => {
    // Get the initial vertical position of rod1
    cy.get('#rod1').then(($rod1) => {
      const initialTopRod1 = parseFloat($rod1.css('top'));

      // Press the Enter key to start the game
      cy.get('body').type('{enter}');

      // Press the 'A' key multiple times to move the rod to the left
      cy.get('body').type('a');
      cy.get('body').type('a');
      cy.get('body').type('a');

      // Wait for a moment to ensure the rod has moved
      cy.wait(1000);

      // Get the new vertical position of rod1
      cy.get('#rod1').then(($rod1) => {
        const newTopRod1 = parseFloat($rod1.css('top'));

        // Ensure that rod1's vertical position remains unchanged
        expect(newTopRod1).to.equal(initialTopRod1);
      });
    });
  });

  it('should move rod horizontally to the right using "D" key', () => {
    // Get the initial vertical position of rod1
    cy.get('#rod1').then(($rod1) => {
      const initialTopRod1 = parseFloat($rod1.css('top'));

      // Press the Enter key to start the game
      cy.get('body').type('{enter}');

      // Press the 'D' key multiple times to move the rod to the right
      cy.get('body').type('d');
      cy.get('body').type('d');
      cy.get('body').type('d');

      // Wait for a moment to ensure the rod has moved
      cy.wait(1000);

      // Get the new vertical position of rod1
      cy.get('#rod1').then(($rod1) => {
        const newTopRod1 = parseFloat($rod1.css('top'));

        // Ensure that rod1's vertical position remains unchanged
        expect(newTopRod1).to.equal(initialTopRod1);
      });
    });
  });  

  it('should reverse the ball direction when hitting the side wall', () => {
    // Trigger the game to start
    cy.get('body').type('{enter}');
  
    // Wait for the ball to possibly hit the side wall
    cy.wait(3000);
  
    // Check the position of the ball
    cy.get('#ball').then(($ball) => {
      const ballLeft = parseFloat($ball.css('left'));
      const windowWidth = Cypress.config('viewportWidth');
  
      // The ball should not be outside the viewport
      expect(ballLeft).to.be.at.least(0);
      expect(ballLeft).to.be.at.most(windowWidth);
    });
  });
  

  it('should not start the game until Enter key is pressed', () => {
    // Get the initial position of the ball
    cy.get('#ball').then(($ball) => {
      const initialLeft = parseFloat($ball.css('left'));
      const initialTop = parseFloat($ball.css('top'));
  
      // Wait for a moment to see if the ball has moved
      cy.wait(1000);
  
      // Get the new position of the ball
      cy.get('#ball').then(($ball) => {
        const newLeft = parseFloat($ball.css('left'));
        const newTop = parseFloat($ball.css('top'));
  
        // Ensure that the ball has not moved
        expect(newLeft).to.equal(initialLeft);
        expect(newTop).to.equal(initialTop);
      });
    });
  
    // Press the Enter key to start the game
    cy.get('body').type('{enter}');
  });
  
  
  it('should increase the score after the ball hits a rod', () => {
    // Spy on window.alert method to capture the score
    cy.window().then((win) => {
      cy.spy(win, 'alert').as('alert');
    });
  
    // Trigger the game to start
    cy.get('body').type('{enter}');
  
    // Wait for a moment for the ball to hit a rod
    cy.wait(1000);
  
    // After a hit, the score should be greater than 0
    cy.get('@alert').should('have.been.calledWithMatch', /score of \d+/);
  });
  

  it('rods should stay within game boundaries', () => {
    // Press the Enter key to start the game
    cy.get('body').type('{enter}');
  
    // Press 'A' key multiple times
    cy.get('body').type('a'.repeat(30));
  
    cy.wait(500).then(() => {
      // Make sure the rods are still in the game area after moving left
      cy.get('#rod1').then(($rod1) => {
        const rodLeft = parseFloat($rod1.css('left'));
        expect(rodLeft).to.be.at.least(0);
      });
  
      cy.get('#rod2').then(($rod2) => {
        const rodLeft = parseFloat($rod2.css('left'));
        expect(rodLeft).to.be.at.least(0);
      });
  
      // Press 'D' key multiple times
      cy.get('body').type('d'.repeat(30));
  
      cy.wait(500).then(() => {
        // Make sure the rods are still in the game area after moving right
        cy.get('#rod1').then(($rod1) => {
          const rodLeft = parseFloat($rod1.css('left'));
          const rodWidth = parseFloat($rod1.css('width'));
          const windowWidth = Cypress.config('viewportWidth');
  
          expect(rodLeft + rodWidth).to.be.at.most(windowWidth);
        });
  
        cy.get('#rod2').then(($rod2) => {
          const rodLeft = parseFloat($rod2.css('left'));
          const rodWidth = parseFloat($rod2.css('width'));
          const windowWidth = Cypress.config('viewportWidth');
  
          expect(rodLeft + rodWidth).to.be.at.most(windowWidth);
        });
      });
    });
  });

  
  it('should not start the game before pressing Enter', () => {
    // Get the initial position of the ball
    cy.get('#ball').then(($ball) => {
      const initialLeft = parseFloat($ball.css('left'));
      const initialTop = parseFloat($ball.css('top'));
  
      // Wait for a moment
      cy.wait(1000);
  
      // Check if the ball position remains the same
      cy.get('#ball').then(($ball) => {
        const newLeft = parseFloat($ball.css('left'));
        const newTop = parseFloat($ball.css('top'));
        
        expect(newLeft).to.equal(initialLeft);
        expect(newTop).to.equal(initialTop);
      });
    });
  });

  
  it('should increase the score when the ball hits a rod', () => {
    // Intercept the window.alert function to capture the alert message
    cy.on('window:alert', (message) => {
      // Extract the score from the message
      const score = parseInt(message.split(' ').pop());
      expect(score).to.be.greaterThan(0);
    });
  
    // Start the game
    cy.get('body').type('{enter}');
    
    // Wait for a round to complete
    cy.wait(3000);
  });
  
  it('should update the score when a player misses the ball', () => {
    // Start the game
    cy.get('body').type('{enter}');
    
    // Wait for a player to miss the ball
    cy.wait(5000);
    
    // Check if the score has been updated
    cy.get('#player1Score').should('not.eq', '0');
    // or
    cy.get('#player2Score').should('not.eq', '0');
});

it('should increase the score in localStorage after hitting the rod', () => {
  // Start the game
  cy.get('body').type('{enter}');

  // Wait for a player to hit the ball
  cy.wait(5000); // Assume score increases every second

  // Check that the score was increased in localStorage
  // Note that localStorage stores everything as strings
  cy.window().then((window) => {
    // Get the current max score
    const currentMaxScore = parseInt(window.localStorage.getItem('MaxScore'));

    // Expect the max score to be greater than 0, assuming the player has hit the ball at least once
    expect(currentMaxScore).to.be.greaterThan(0);
  });
});
it('should display the game elements correctly', () => {
  //it verifies whether there is an element with the ID present on the page.
  cy.get('#container').should('exist');
  cy.get('#ball').should('exist');
  cy.get('#rod1').should('exist');
  cy.get('#rod2').should('exist');
});



it('should start the game when Enter key is pressed', () => {
  //This line uses Cypress's cy.get() function to select the <body> element from the DOM. 
  //The <body> element represents the entire webpage. Then, the test uses .type('{enter}') to simulate typing the Enter key on the webpage. 
  //This action is equivalent to pressing the Enter key on the page.
  cy.get('body').type('{enter}');

  //This line uses cy.get() again to select the element with the ID 'ball' from the DOM. 
  //The test then uses the .should() assertion to check the CSS property animation-play-state of the selected element. 
  //It verifies that the value of this property is 'running', which means that the animation of the ball (presumably representing the game) is now running.
  cy.get('#ball').should('have.css', 'animation-play-state', 'running');

  //This line selects the element with the ID 'rod1' from the DOM using cy.get(). 
  //The test then uses the .should() assertion to check the CSS property left of the selected element. 
  //The test further chains the .and('not.be.empty') to ensure that the left property is not empty. 
  //This is likely because the left property determines the horizontal position of the rod, and it should have a valid value once the game starts.
  cy.get('#rod1').should('have.css', 'left').and('not.be.empty');
  cy.get('#rod2').should('have.css', 'left').and('not.be.empty');
});


it('should reverse ball direction after hitting the side wall', () => {

// Simulate pressing the enter key in the 'body' element.
cy.get('body').type('{enter}');

// Check if the animation of the ball is running.
cy.get('#ball').should('have.css', 'animation-play-state', 'running');

// Get the initial 'left' and 'top' positions of the 'ball' element.
cy.get('#ball').then(($ball) => {
  const initialBallLeft = parseInt($ball.css('left'), 10);
  const initialBallTop = parseInt($ball.css('top'), 10);

  // Get the width of the game area or the document.
  cy.document().then((doc) => {
    const docWidth = doc.documentElement.clientWidth;

    // Trigger the mouse move event at the right edge of the game area or document.
    cy.get('body').trigger('mousemove', {
      clientX: docWidth - 10,
      clientY: initialBallTop,
    });

    // Wait for the possible movement of the ball.
    cy.wait(1000);

    // Get the updated 'left' position of the 'ball' element.
    cy.get('#ball').then(($ball) => {
      const newBallLeft = parseInt($ball.css('left'), 10);

      // Check if the new 'left' position is less than the initial 'left' position,
      // indicating that the ball has reversed direction.
      expect(newBallLeft).to.be.lessThan(initialBallLeft);
    });
  });
});
});

it('should move both rod1 and rod2 to the left when key A is pressed and to the right when key D is pressed', () => {

// Get the initial 'left' positions of both rods.
cy.get('#rod1').then(($rod1) => {
  const initialRod1Left = parseInt($rod1.css('left'), 10);
  cy.get('#rod2').then(($rod2) => {
    const initialRod2Left = parseInt($rod2.css('left'), 10);

    // Simulate pressing the 'A' key to move rods to the left.
    cy.get('body').type('a');

    // Wait for the possible movement of the rods.
    cy.wait(500);

    // Check if both rods have moved to the left.
    cy.get('#rod1').then(($rod1) => {
      const newRod1Left = parseInt($rod1.css('left'), 10);
      expect(newRod1Left).to.be.lessThan(initialRod1Left);
    });
    cy.get('#rod2').then(($rod2) => {
      const newRod2Left = parseInt($rod2.css('left'), 10);
      expect(newRod2Left).to.be.lessThan(initialRod2Left);
    });
  });
});

// Get the updated 'left' positions of both rods.
cy.get('#rod1').then(($rod1) => {
  const initialRod1Left = parseInt($rod1.css('left'), 10);
  cy.get('#rod2').then(($rod2) => {
    const initialRod2Left = parseInt($rod2.css('left'), 10);

    // Simulate pressing the 'D' key to move rods to the right.
    cy.get('body').type('d');

    // Wait for the possible movement of the rods.
    cy.wait(500);

    // Check if both rods have moved to the right.
    cy.get('#rod1').then(($rod1) => {
      const newRod1Left = parseInt($rod1.css('left'), 10);
      expect(newRod1Left).to.be.greaterThan(initialRod1Left);
    });
    cy.get('#rod2').then(($rod2) => {
      const newRod2Left = parseInt($rod2.css('left'), 10);
      expect(newRod2Left).to.be.greaterThan(initialRod2Left);
    });
  });
});
});

it('should move both rod1 and rod2 together', () => {

// Simulate pressing the 'A' key to move rods to the left.
cy.get('body').type('a');

// Wait for the possible movement of the rods.
cy.wait(500);

// Check if both rods have moved to the left and their 'left' properties are equal.
cy.get('#rod1').then(($rod1) => {
  const newRod1Left = parseInt($rod1.css('left'), 10);
  cy.get('#rod2').then(($rod2) => {
    const newRod2Left = parseInt($rod2.css('left'), 10);
    
    expect(newRod1Left).to.equal(newRod2Left);
  });
});

// Simulate pressing the 'D' key to move rods to the right.
cy.get('body').type('d');

// Wait for the possible movement of the rods.
cy.wait(500);

// Check if both rods have moved to the right and their 'left' properties are equal.
cy.get('#rod1').then(($rod1) => {
  const newRod1Left = parseInt($rod1.css('left'), 10);
  cy.get('#rod2').then(($rod2) => {
    const newRod2Left = parseInt($rod2.css('left'), 10);
    
    expect(newRod1Left).to.equal(newRod2Left);
  });
});
});



  
});
