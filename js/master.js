// List of allowed keys
const allowedKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Enter'];

// Initialize variables
let currentGuess = ""; // Current guess string
let gameOver = false; // Flag to indicate if the game is over

// Generate seed for random number generator based on current date
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // Set time to midnight to remove time component
let seed = currentDate.getTime(); // Get the timestamp in milliseconds
// seed = Math.random() // RANDOM SEED FOR DEVELOPMENT PURPOSES ONLY: REMOVE BEFORE DEPLOYMENT

// Get saved data from local storage, or create a new object if it doesn't exist
let formatleData = localStorage.formatleData
if (!formatleData || JSON.parse(localStorage.formatleData).currentSeed != seed) {
    // If formatleData is not in local storage or the seed (and therfore date) has changed, create a new formatleData object
    formatleData = {
        currentSeed: seed,
        guessList: [],
    };
} else {
    // If formatleData is in local storage and the seed (and therfore date) has not changed, parse the existing formatleData object
    formatleData = JSON.parse(localStorage.formatleData);
}
localStorage.formatleData = JSON.stringify(formatleData); // Store the formatleData in local storage

async function loadSave() {
    if (formatleData.guessList.length > 0) { // If there are previous guesses, update the previous cells

        let currentFormat = await getCurrentFormat(); // Get the current format

        
        let rows = document.querySelectorAll('#game-board > .row'); // Get all rows from the DOM
        formatleData.guessList.forEach((currentGuess, i) => { // Loop through each guess
            let row = rows[i]; // Get the current row
            let cells = row.querySelectorAll('.cell'); // Get all cells in the row
            
            let currentGuessArray = currentGuess.split(''); // Split the current guess into an array of letters
            let currentFormatArray = currentFormat.split(''); // Split the current format into an array of letters

            let cellColors = Array(cells.length).fill(0); // Initialize an array to store the color states of the cells

            // Assign green color to letters in the correct position, and remove them from the current format list to avoid double counting
            currentGuessArray.forEach((item, i) => { // Loop through each letter in the current guess
                if (item.toUpperCase() == currentFormatArray[i].toUpperCase()) { // If the letter is in the correct position
                    cellColors[i] = '3'; // Set the color state to '2' (green)
                    currentFormatArray[i] = ''; // Remove the letter from the current format list
                }
            });

            // Assign yellow color to letters that are in the format but not in the correct position, and remove them from the current format list to avoid double counting
            currentGuessArray.forEach((item, i) => { // Loop through each letter in the current guess
                if (cellColors[i] != '3' && currentFormatArray.includes(item.toUpperCase())) { // If the letter is not in the correct position and is in the current format list
                    cellColors[i] = '2'; // Set the color state to '2' (yellow)
                    currentFormatArray[currentFormatArray.indexOf(item.toUpperCase())] = ''; // Remove the letter from the current format list
                }
            });

            // Assign gray color to letters that are not in the format
            currentGuessArray.forEach((item, i) => { // Loop through each letter in the current guess
                if (cellColors[i] == '0') { // If the letter is not in the correct position and is not in the current format list
                    cellColors[i] = '1'; // Set the color state to '1' (gray)
                }
            });

            
            currentGuessArray.forEach((item, i) => { // Set the text content of the cells to the letters of the current guess
                cells[i].textContent = item.toUpperCase(); // Set the text content of the cell to the letter
            }); 

            cellColors.forEach((color, i) => { // Set the color of the cells based on the color states
                currentGuessArray.filter((item, i) => color == '3').forEach((item, i) => {
                    setKeyColorState(item, 3)
                })
                currentGuessArray.filter((item, i) => color == '2').forEach((item, i) => {
                    if (getKeyColorState(item)<=2) setKeyColorState(item, 2);
                })
                currentGuessArray.filter((item, i) => color == '1').forEach((item, i) => {
                    if (getKeyColorState(item)<=2) setKeyColorState(item, 1);
                })
                cells[i].dataset.colorState = color
            })

        })

        checkGameState(); // Check the game state after loading the save
    }
}