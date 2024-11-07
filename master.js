sendAlert("Welcome to the Formatle!\nTry to guess the filetype extension (for example, mp3 or pdf) every day!\nEnjoy!\n(I know this looks kinda ugly right now, and I hopefully will come back and improve it someday)")

let gameBoard = document.getElementById('game-board');
let rows;

let length;
let guesses;
let guessNumber = 0;
let wordList;
let currentWord;
let guessesList = [];
let usesList;

let validChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

let currentGuess = "";

let  data = async () => await fetch('https://script.google.com/macros/s/AKfycbx10t-QS9EaP8S0wZZ2XN_VR0XvK7EfXvxAVWDB3LwddBQ3qmRDjz0VY24GkxwBGxtamQ/exec').then(res=>res.json());

setBoard();

async function setBoard() {
  await data().then(res=>{
    length = res.currentWord.length;
    guesses = res.numberOfGuesses;
    wordList = res.wordList;
    currentWord = res.currentWord;
    usesList = res.typeDescriptions;

    if (localStorage.currentWord && JSON.parse(localStorage.currentWord) == currentWord) {
      guessesList = JSON.parse(localStorage.guessesList);
    } else {
      localStorage.currentWord = JSON.stringify(currentWord);
      localStorage.guessesList = JSON.stringify(guessesList);
    }
    gameBoard.innerHTML = ""
  })


  for (let i = 0; i < guesses; i++) {
    let row = document.createElement('div');
    row.classList.add('row');
    gameBoard.appendChild(row);
  }
  rows = document.querySelectorAll('.row');
  rows.forEach(row => {
    for (let i = 0; i < length; i++) {
      cell = document.createElement('div');
      cell.classList.add('cell');
      row.appendChild(cell);
    }
  });

  guessesList.forEach((item, i) => {
    Array.from(rows[i].children).forEach((item2, i2) => {
      if (item[i2]) {
        item2.textContent = item[i2];
      }
    });
    currentGuess = guessesList[i]
    enter(true)
  });
  currentGuess = '';

  console.log('Setup Complete');
}

function sendLetter(letter) {
  if (currentGuess.length < length) {
    currentGuess+=letter.toUpperCase();
  }
  updateBoard();
}

function backspace() {
  if (currentGuess.length > 0) {
    currentGuess=currentGuess.slice(0,-1);
  }
  updateBoard()
}

async function enter(starting) {
  if (currentGuess.length == length && wordList.includes(currentGuess.toUpperCase())) {
    let currentGuessList = currentGuess.split('');
    let currentWordList = currentWord.split('');
    let rowCells = rows?rows[guessNumber].querySelectorAll('.cell'):undefined;
    currentGuessList.forEach((item, i) => {
      if (item == currentWordList[i]) {
        rowCells[i].classList.add('green','filled');
        currentWordList[i] = '';
      }
    });
    currentGuessList.forEach((item, i) => {
      if (rowCells[i].classList.contains('green')) {

      } else if (currentWordList.includes(item)) {
        rowCells[i].classList.add('yellow','filled');
        currentWordList[currentWordList.indexOf(item)] = '';
      }
    });
    currentGuessList.forEach((item, i) => {
      if (rowCells[i].classList.contains('green') || rowCells[i].classList.contains('yellow')) {

      } else  {
        rowCells[i].classList.add('grey','filled');
      }
    });

    guessNumber++
    if (!starting) {
      guessesList.push(currentGuess)
      localStorage.guessesList = JSON.stringify(guessesList)
    }

    if (currentGuess == currentWord) {
      sendAlert('You won!\nThe filetype was ' + currentWord+'.\n'+'Here are the use(s) of this filetype:\n'+usesList.join('\n'));
      guessNumber = guesses;
    } else if (guessNumber == guesses) {
      sendAlert('You lost.\nThe filetype was ' + currentWord+'.\n'+'Here are the use(s) of this filetype:\n'+usesList.join('\n'));
    }

    currentGuess = ""
  }
}

function updateBoard() {
  if (!rows) return;
  let rowCells = rows?rows[guessNumber].querySelectorAll('.cell'):undefined;
  let cellLetters = currentGuess.split('');
  rowCells.forEach((item,i) => {
    item.textContent = cellLetters[i]?.toUpperCase();
  });

}

window.addEventListener('keydown',e=>{
  if (guessNumber >= guesses) {

  } else if (validChars.includes(e.key)) {
    sendLetter(e.key)
  } else if (e.key == "Backspace") {
    backspace()
  } else if (e.key == "Enter") {
    enter(false)
  }
})

async function sendAlert(message) {
  setTimeout(function () {
    window.alert(message)
  }, 10);

}
