"use strict";

// DOM
const btns = document.querySelectorAll("BUTTON");
const answerPadItem = document.querySelectorAll(".answer_pad_item");
const answerPadCircles = document.querySelectorAll(".answer_pad_circle");
const scoreLabel = document.querySelector(".score_label");
const highScoreLabel = document.querySelector(".high_score_label");
const chancesLeftLabel = document.querySelector(".chances_left");
const questionLabel = document.querySelector(".question_box_letter");
const modeToggle = document.querySelector('.mode_toggle');

modeToggle.addEventListener('click', function() {
  if (document.body.classList.length === 0) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});

// Game Play
let kanaList = [];
let answerId = document.querySelector("[data-answer-id]");

// Game Settings
const game = {
  gameType: "ひらがな",
  score: 0,
  highScore: 0,
  wrong: 0,
  chancesLeft: 0,
}

// For all buttons.
btns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    changePage(btn);
  })
})

// For all answer buttons in the game.
answerPadItem.forEach(function (btn) {
  btn.addEventListener("click", function () {
    checkAnswer(btn);
  })
})

// 関数

// Change Page
function changePage(btn) {
  const gameType = btn.textContent;
  const dataOpenId = btn.getAttribute(`data-open`);
  const dataCloseId = btn.getAttribute(`data-close`);
  if (dataCloseId !== null && dataCloseId !== undefined) {
    closePage(dataCloseId);
  }
  if (dataOpenId !== null && dataOpenId !== undefined) {
    openPage(dataOpenId, gameType);
  }
}

// Open Page
function openPage(dataOpenId, gameType) {
  if (dataOpenId === "game") initGame(gameType);
  document.querySelector(`[data-page="${dataOpenId}"`).classList.remove("hidden");
}

// Close Page
function closePage(dataCloseId) {
  document.querySelector(`[data-page="${dataCloseId}"`).classList.add("hidden");
}

// Init Game
function initGame(gameType) {
  game.gameType = gameType; // Set the gameType to the game object.
  if (game.gameType === "ひらがな") {
    kanaList = Object.values(hiraganaList);
  } else if (game.gameType === "カタカナ") {
    kanaList = Object.values(katakanaList);
  } else if (game.gameType === "ALL KANA") {
    kanaList = Object.values(hiraganaList).concat(Object.values(katakanaList));
  } else {
    console.log(`エラー`);
  }
  game.score = 0;
  game.wrong = 0;
  game.chancesLeft = 10;
  updateScore();
  getQuestion();
}

// Game Over
function gameOver() {
  document.querySelector(".game_over_score").textContent = game.score;
  document.querySelector(`[data-page="game"]`).classList.add("hidden");
  document.querySelector(`[data-page="game_over"]`).classList.remove("hidden");
}

// Add Score
function addScore() {
  if (game.wrong >= 3) {
    game.score += 0;
  } else if (game.wrong === 2) {
    game.score += 25;
  } else if (game.wrong === 1) {
    game.score += 50;
  } else {
    game.score += 100;
  }
  if (game.score > game.highScore) game.highScore = game.score;
  game.wrong = 0;
}

// Update Score
function updateScore() {
  scoreLabel.textContent = game.score;
  highScoreLabel.textContent = game.highScore;
  chancesLeftLabel.textContent = game.chancesLeft;
}

// Get a question
function getQuestion() {

  const picker = Math.floor(Math.random() * kanaList.length); // Generate a random number that is max or below the kanaList.
  questionLabel.textContent = kanaList[picker][0]; // Use the picker to get a letter out of the kanaList.
  answerId = kanaList[picker][1]; // Use the picker to get a letter out of the kanaList.
  answerPadItem.forEach(item => item.textContent = ""); // Clear the answer choices.
  const rightAnswer = Math.floor(Math.random() * answerPadItem.length); // Generate a random number that is max or below the answerPad buttons.
  answerPadItem[rightAnswer].innerText = kanaList[picker][1]; // Put the right answer in one of the answepad buttons.
  console.log(`The right answer "${kanaList[picker][1]}" is set at spot ${rightAnswer + 1}.`);


  // Loop over each answerPad.
  answerPadItem.forEach(item => {
    item.classList.remove("wrong"); // Make sure to remove the "wrong" class from every item.
    if (item.textContent === "") { // Check to see if the item is blank. If it isn't, it should be the right answer and skipped.
      let answerChoicePicker = Math.floor(Math.random() * kanaList.length); // Generate a random number that is max or below the kanaList.
      let answerChoice = kanaList[answerChoicePicker][1]; // This is to get an answer choice.
      console.log(`Answer Choice: ${answerChoice} === "${item.innerText}"?`); // This is used to debugging purposes.

      let step = 1; // This is being used in a while loop.
      // Loop over all 4 of the answer pads and check to see if the answer choice is the same answer.
      while (step === 1) {
        if (answerChoice === answerPadItem[0].innerText || answerChoice === answerPadItem[1].innerText || answerChoice === answerPadItem[2].innerText || answerChoice === answerPadItem[3].innerText) {
          answerChoicePicker = Math.floor(Math.random() * kanaList.length); // Generate a random number that is max or below the kanaList.
          answerChoice = kanaList[answerChoicePicker][1]; // This is to get an answer choice.
          console.log(`⛔ There is a match! Time to re-roll the answerChoice picker. Answer Choice Re-roll: ${answerChoice} === "${item.innerText}"?`); // This is used to debugging purposes.
        } else {
          item.innerText = answerChoice; // Add the answer choice to the current item.
          step++; // Use this to end the for loop.
        }
      }
    } else {
      // If the answerPad is already filled (because it is the right answer), this message will be displayed.
      console.log(`Spot ${rightAnswer + 1} was already taken and should show the right answer, "${kanaList[picker][1]}".`); // This is used to debugging purposes.
    }
  })

  console.log(
    Date(),
    `Answer Choice 1: "${answerPadItem[0].innerText}"`, // This is used to debugging purposes.
    `Answer Choice 2: "${answerPadItem[1].innerText}"`, // This is used to debugging purposes.
    `Answer Choice 3: "${answerPadItem[2].innerText}"`, // This is used to debugging purposes.
    `Answer Choice 4: "${answerPadItem[3].innerText}"` // This is used to debugging purposes.
  );
}

// Check Answer
function checkAnswer(guess) {
  if (guess.innerText === answerId) {
    addScore();
    getQuestion();
  } else {
    guess.classList.add("wrong");
    game.wrong++;
    game.chancesLeft--;
    if (game.chancesLeft === 0) gameOver();
  }
  updateScore();
}