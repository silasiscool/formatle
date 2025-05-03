// This file contains the setup for the game board
// The grid of cells is created and displayed on the screen

const gameBoard = document.getElementById('game-board'); // Get the game board element from the DOM

setupGameBoard(); // Call the function to set up the game board

async function setupGameBoard() {
    gameBoard.innerHTML = ''; // Clear the game board

    const currentFormat = await getCurrentFormat(); // Get the current format
    const formatLength = currentFormat.length; // Get the length of the current format
    const allowedGuesses = await getNumAllowedGuesses(); // Get the number of allowed guesses
    
    let rows = []; // Initialize an empty array to store the rows of the game board

    for (let i=0; i < allowedGuesses; i++) { // Loop through the number of allowed guesses
        let row = document.createElement('div'); // Create a new div element for each row
        row.classList.add('row'); // Add the 'row' class to the row element
        gameBoard.appendChild(row); // Append the row to the game board

        rows.push(row); // Add the row to the rows array
    }

    rows.forEach(row => {
        for (let i=0; i < formatLength; i++) { // Loop through the length of the current format
            let cell = document.createElement('div'); // Create a new div element for each cell
            cell.classList.add('cell'); // Add the 'cell' class to the cell element
            cell.dataset.colorState = '0'; // Set the initial color state of the cell to '0'
            row.appendChild(cell); // Append the cell to the row
        }
    })
    

    loadSave(); // Call the function to load the saved game state
}
