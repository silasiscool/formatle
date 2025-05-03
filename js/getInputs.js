// This file is involved in getting inputs from the user via the keyboard ui, as well as the physical keyboard.



// Physical keyboard input
document.addEventListener('keydown', e => keyPressed(e)); // Add event listener for keydown event on the document
function keyPressed(e) { // Callback function for keydown event
    // Check if the key pressed is in the allowed keys list
    if (!allowedKeys.includes(e.key)) {
        return; // If not, return and do nothing 
    }

    sendInput(e.key); // Call the sendInput function with the key pressed as argument
}


// On screen keyboard input

// This is a class that represents a key on the keyboard
class Key {
    constructor(key, label, row, col, wideKey = false, colorState = 0) { // Constructor for the Key class
        this.key = key; // Key value
        this.label = label; // Label to be displayed on the key
        this.row = row; // Row position in the keyboard layout
        this.col = col; // Column position in the keyboard layout
        this.wideKey = wideKey; // Boolean to indicate if the key is a wide key (default is false)
        this.colorState = colorState; // Color of the key (0 for default, 1 for not present, 1 for yellow, 2 for green)
    }

    clicked() { // Function to send input when the key is pressed
        sendInput(this.key); // Call the sendInput function with the key value as argument
    }

}

// Keyboard layout data

// Keyboard layout data for QWERTY layout
const qwertyLayout = [
    new Key('1', '1', 0, 0),
    new Key('2', '2', 0, 1),
    new Key('3', '3', 0, 2),
    new Key('4', '4', 0, 3),
    new Key('5', '5', 0, 4),
    new Key('6', '6', 0, 5),
    new Key('7', '7', 0, 6),
    new Key('8', '8', 0, 7),
    new Key('9', '9', 0, 8),
    new Key('0', '0', 0, 9),
    new Key('q', 'Q', 1, 0),
    new Key('w', 'W', 1, 1),
    new Key('e', 'E', 1, 2),
    new Key('r', 'R', 1, 3),
    new Key('t', 'T', 1, 4),
    new Key('y', 'Y', 1, 5),
    new Key('u', 'U', 1, 6),
    new Key('i', 'I', 1, 7),
    new Key('o', 'O', 1, 8),
    new Key('p', 'P', 1, 9),
    new Key('a', 'A', 2, 0),
    new Key('s', 'S', 2, 1),
    new Key('d', 'D', 2, 2),
    new Key('f', 'F', 2, 3),
    new Key('g', 'G', 2, 4),
    new Key('h', 'H', 2, 5),
    new Key('j', 'J', 2, 6),
    new Key('k', 'K', 2, 7),
    new Key('l', 'L', 2, 8),
    new Key('Enter', 'ENTER', 3, 0, true),
    new Key('z', 'Z', 3, 1),
    new Key('x', 'X', 3, 2),
    new Key('c', 'C', 3, 3),
    new Key('v', 'V', 3, 4),
    new Key('b', 'B', 3, 5),
    new Key('n', 'N', 3, 6),
    new Key('m', 'M', 3, 7),
    new Key('Backspace', '<span class="material-symbols-outlined">backspace</span>', 3, 8, true)
]

const dvorakLayout = [
    new Key('1', '1', 0, 0),
    new Key('2', '2', 0, 1),
    new Key('3', '3', 0, 2),
    new Key('4', '4', 0, 3),
    new Key('5', '5', 0, 4),
    new Key('6', '6', 0, 5),
    new Key('7', '7', 0, 6),
    new Key('8', '8', 0, 7),
    new Key('9', '9', 0, 8),
    new Key('0', '0', 0, 9),
    new Key('Enter', 'ENTER', 1, 0, true),
    new Key('p', 'P', 1, 1),
    new Key('y', 'Y', 1, 2),
    new Key('f', 'F', 1, 3),
    new Key('g', 'G', 1, 4),
    new Key('c', 'C', 1, 5),
    new Key('r', 'R', 1, 6),
    new Key('l', 'L', 1, 7),
    new Key('backspace', '<span class="material-symbols-outlined">backspace</span>', 1, 8, true),
    new Key('a', 'A', 2, 0),
    new Key('o', 'O', 2, 1),
    new Key('e', 'E', 2, 2),
    new Key('u', 'U', 2, 3),
    new Key('i', 'I', 2, 4),
    new Key('d', 'D', 2, 5),
    new Key('h', 'H', 2, 6),
    new Key('t', 'T', 2, 7),
    new Key('n', 'N', 2, 8),
    new Key('s', 'S', 2, 9),
    new Key('q', 'Q', 3, 0),
    new Key('j', 'J', 3, 1),
    new Key('k', 'K', 3, 2),
    new Key('x', 'X', 3, 3),
    new Key('b', 'B', 3, 4),
    new Key('m', 'M', 3, 5),
    new Key('w', 'W', 3, 6),
    new Key('v', 'V', 3, 7),
    new Key('z', 'Z', 3, 8),
]

layouts = [qwertyLayout, dvorakLayout]; // Array of keyboard layouts

// Function to send input when a key is clicked
function setupKeyboard(layout) {
    const keyboard = document.getElementById('keyboard'); // Get the keyboard element from the DOM
    const rows = document.querySelectorAll('#keyboard > .row'); // Get all the rows in the keyboard element

    layout.forEach(key => { // Loop through each key in the layout
        let keyElement = document.createElement('button'); // Create a new div element for the key
        keyElement.classList.add('key'); // Add the 'key' class to the key element
        keyElement.dataset.key = key.key; // Set the data-key attribute to the key value
        keyElement.dataset.colorState = key.colorState; // Set the data-color-state attribute to the key color
        keyElement.innerHTML = key.label; // Set the text content of the key element to the key value 
        if (key.wideKey) keyElement.classList.add('wide'); // If the key is a wide key, add the 'wide' class
        
        keyElement.addEventListener('click', () => sendInput(key.key)); // Add click event listener to the key element to call the sendKeyInput function with the key value as argument

        rows[key.row].appendChild(keyElement); // Append the key element to the corresponding row in the keyboard
    }); 
}

function getKeyColorState(key) { // Function to get the color state of a key
    const keyElement = document.querySelector(`[data-key="${key}"]`); // Get the key element with the specified key value
    if (!keyElement) { // If the key element does not exist
        return; // Exit the function
    }
    return keyElement.dataset.colorState; // Return the color state of the key element
}

// Function to change the color of the desired key
function setKeyColorState(key, colorState) {
    const keyElement = document.querySelector(`[data-key="${key}"]`); // Get the key element with the specified key value
    if (!keyElement) { // If the key element does not exist
        return; // Exit the function
    }
    keyElement.dataset.colorState = colorState; // Update the data-color-state attribute to the new color state
}

setupKeyboard(layouts[0]); // Call the setupKeyboard function with the QWERTY layout as argument