// Project 03: Clicker Game
// Built by Jaylon Montes 😎

// GAME STATE
let score = 0;
let timeLeft = 10;
let gameActive = true;

// ELEMENTS
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const button = document.getElementById("clickBtn");
const message = document.getElementById("message");

// CLICK BUTTON LOGIC
button.addEventListener("click", function () {
  if (gameActive) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
  }
});

// TIMER LOGIC
const timer = setInterval(function () {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = "Time Left: " + timeLeft;
  } else {
    endGame();
  }
}, 1000);

// END GAME FUNCTION
function endGame() {
  gameActive = false;
  button.disabled = true;
  message.textContent = "Game Over! Final Score: " + score;
  clearInterval(timer);
}

