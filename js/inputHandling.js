// Handles the input from the user and updates the game board accordingly

// This function handles all inputs and runs the appropriate function based on the input
// It also checks if the input is valid befor proceeding
function sendInput(input) {
    if (gameOver) {
        return; // Ignore input if the game is over
    }
   if (!allowedKeys.includes(input)) {
       return; // Ignore invalid keys
   }
   if (input === 'Backspace') {
       backspaceKey();
   } else if (input === 'Enter') {
       enterKey();
   } else {
       keyPress(input);
   }
}

// This functions letter and number keys
async function keyPress(key) {
    let currentFormat = await getCurrentFormat(); // Get the current format
    let formatLength = currentFormat.length; // Get the length of the current format
    if (currentGuess.length >= formatLength) {
        return; // Ignore if the current guess is already full
    }
    currentGuess += key; // Add the key to the current guess

    let rows = document.querySelectorAll('#game-board > .row'); // Get all rows from the DOM
    let guessNum = formatleData.guessList.length; // Get the current guess number
    let currentRow = rows[guessNum]; // Get the current row
    let cells = currentRow.querySelectorAll('.cell'); // Get all cells in the current row

    currentGuess.split('').forEach((item, i) => { // Set the text content of the cells to the letters of the current guess
        cells[i].textContent = item.toUpperCase(); // Set the text content of the cell to the letter
    }); 

    cells[currentGuess.length - 1].classList.add('filled'); // Add the 'filled' class to the last cell of the current guess
}

// This function handles the backspace key
function backspaceKey() {
    currentGuess = currentGuess.slice(0,-1); // Remove the last letter from the current guess

    let rows = document.querySelectorAll('#game-board > .row'); // Get all rows from the DOM
    let guessNum = formatleData.guessList.length; // Get the current guess number
    let currentRow = rows[guessNum]; // Get the current row
    let cells = currentRow.querySelectorAll('.cell'); // Get all cells in the current row

    cells.forEach((cell, i) => { // Set the text content of the cells to the letters of the current guess
        cell.textContent = currentGuess[i]?.toUpperCase(); // Set the text content of the cell to the letter
    }); 

    cells[currentGuess.length].classList.remove('filled'); // Remove the 'filled' class from the last cell of the current guess
}

// This function handles the enter key, and submits the current guess if appropriate
async function enterKey() {
    let currentFormat = (await getCurrentFormat()).toUpperCase(); // Get the current format
    let formatLength = currentFormat.length; // Get the length of the current format
    if (currentGuess.length < formatLength) {
        window.alert("Not enough letters"); // Show an alert if the current guess is not full
        return; // Ignore if the current guess is not full
    }
    let sameLengthFormats = await getSameLengthFormats(); // Get formats with the same length as the current format
    if (!sameLengthFormats.includes(currentGuess.toUpperCase())) {
        window.alert("Not a valid format"); // Show an alert if the current guess is not in the list of formats with the same length
        return; // Ignore if the current guess is not in the list of formats with the same length
    }

    let rows = document.querySelectorAll('#game-board > .row'); // Get all rows from the DOM
    let guessNum = formatleData.guessList.length; // Get the current guess number
    let currentRow = rows[guessNum]; // Get the current row
    let cells = currentRow.querySelectorAll('.cell'); // Get all cells in the current row

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

    // Animate adding the colors to the cells
    let i = 0; // Initialize a counter for the animation
    let interval = setInterval(() => { // Set an interval to animate the cell colors
        if (i >= cells.length) { // If all cells have been animated
            clearInterval(interval); // Clear the interval

            // Update Keyboard colors once interval is cleared
            currentGuessArray.filter((item, i) => cellColors[i] == '3').forEach((item, i) => {
                setKeyColorState(item, 3)
            })
            currentGuessArray.filter((item, i) => cellColors[i] == '2').forEach((item, i) => {
                if (getKeyColorState(item)<=2) setKeyColorState(item, 2);
            })
            currentGuessArray.filter((item, i) => cellColors[i] == '1').forEach((item, i) => {
                if (getKeyColorState(item)<=2) setKeyColorState(item, 1);
            })

            checkGameState(); // Check the game state after the animation is complete
            return; // Exit the function
        }
        cells[i].dataset.colorState = cellColors[i]; // Set the color state of the cell to the corresponding value in the cellColors array
        i++; // Increment the counter
    }, 150); // Set the interval time to 150 milliseconds


    // cellColors.forEach((colorState, i) => { // Loop through each cell color state and set the corresponding cell color
    //     cells[i].dataset.colorState = colorState; // Set the color state of the cell to the corresponding value in the cellColors array
    // })



    formatleData.guessList.push(currentGuess); // Add the current guess to the list of guesses
    localStorage.formatleData = JSON.stringify(formatleData); // Store the formatleData in local storage
    currentGuess = ''; // Reset the current guess
}


async function checkGameState() {
    let currentFormat = (await getCurrentFormat()).toUpperCase(); // Get the current format
    let currentGuess = formatleData.guessList[formatleData.guessList.length-1]; // Get the last guess from the list of guesses
    console.table({currentFormat, currentGuess});

    if (currentGuess.toUpperCase() == currentFormat) {
        setTimeout(() => {
            if (window.confirm("You win!\n\nDo you want to learn about this file format?")) // Show an alert if the last guess is correct
                window.open(`https://www.google.com/search?q=${currentFormat}-file-format`, '_blank'); // Open a new tab with the search query
        }, 500); // Wait for 1/2 second before showing the alert
        gameOver = true; // Set the game over flag to true
    } else if (formatleData.guessList.length >= await getNumAllowedGuesses()) { // Check if the user has used all their guesses
        setTimeout(() => {
            if (window.confirm(`You lose\nThe correct file format was ${currentFormat}\n\nDo you want to learn about this file format?`)) // Show an alert if the last guess is correct
                window.open(`https://www.google.com/search?q=${currentFormat}-file-format`, '_blank'); // Open a new tab with the search query
        }, 500); // Wait for 1/2 second before showing the alert
        gameOver = true; // Set the game over flag to true
    }
}