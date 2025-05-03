// Functions involved in getting the format list and current format

// Create random number generator with a seed based on the current date on load
let randomGet = new Math.seedrandom(formatleData.currentSeed); // Create a seeded random number generator
let randomNumber = randomGet(); // Get a random number between 0 and 1 

// Get format list from CSV file
// This function fetches the CSV file, splits it into lines, and removes empty lines to get a list of formats
async function getFormatList() {
    let formats = await fetch('data/formats.csv').then(res=>res.text()); // Fetch the CSV file and convert it to text
    formats = formats.split(new RegExp('\r|\n')); // Split into lines
    formats = formats.filter(item => item != ''); // Remove empty lines
    return formats
}

// Get current format
// This function gets the current format based on the random number generator and the format list
async function getCurrentFormat() {
    let formats = await getFormatList(); // Get the format list
    let randomIndex = Math.floor(randomNumber * formats.length); // Get a random index based on the random number generator
    let currentFormat = formats[randomIndex]; // Get the format at the random index
    return currentFormat
}

// Get list of formats with the same length as current format
// This function filters the format list to get formats with the same length as the current format
async function getSameLengthFormats() {
    let formats = await getFormatList(); // Get the format list
    let currentFormat = await getCurrentFormat(); // Get the current format
    let sameLengthFormats = formats.filter(format => format.length == currentFormat.length); // Filter formats with the same length as the current format
    return sameLengthFormats
}

async function getNumAllowedGuesses() { // Function to get the number of allowed guesses
    const currentFormat = await getCurrentFormat(); // Get the current format
    const formatLength = currentFormat.length; // Get the length of the current format
    const sameLengthFormats = await getSameLengthFormats(); // Get formats with the same length as the current format
    const numSameLengthFormats = sameLengthFormats.length; // Get the number of formats with the same length as the current format

    const allowedGuesses = Math.min( // Calculate the number of allowed guesses 
        numSameLengthFormats, // Minimum number of allowed guesses based on the number of formats with the same length
        Math.ceil(36/formatLength) // Maximum number of allowed guesses based on the format length
    )
    return allowedGuesses; // Return the number of allowed guesses
}