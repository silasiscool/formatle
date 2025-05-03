let user = "silasiscool";
let repo = "formatle";

let mainUpdatedText = document.getElementById('main-updated-text');

// List of months for formatting the date
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

// Fetch the latest commit date from the GitHub API
fetch(`https://api.github.com/repos/${user}/${repo}/commits`)
    .then(res=>res.json())
    .then(res=>updateText(res[0]?.commit.author.date))

// Function to update the text with the latest commit date
function updateText(date) {

    // If the date is not available, clear the text and return
    if (!date) {
        mainUpdatedText.textContent = '';
        return;
    }

    // If the date is available, format it and update the text
    date = new Date(date);  // Convert the date string to a Date object
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    text = `Last Updated ${month} ${day}, ${year}`;

    mainUpdatedText.textContent = text;
}
