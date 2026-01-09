// Project 03: Clicker Game
// Built by Jaylon Montes 😎

// GAME STATE
let score = 0;
let timeLeft = 10;
let gameActive = true;
let countdown = 3;


// ELEMENTS
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const button = document.getElementById("clickBtn");
const message = document.getElementById("message");

// CLICK BUTTON LOGIC
startBtn.addEventListener("click", function () {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name first 🙂");
    return;
  }

  playerName = nameInput.value;
  gameStarted = true;

  startBtn.disabled = true;
  nameInput.disabled = true;

  message.textContent = "Get ready... ⏱️";

  countdown = 3;
  message.textContent = countdown;

  const countdownTimer = setInterval(function () {
    countdown--;

    if (countdown > 0) {
      message.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      message.textContent = "GO! 🚀";
      startGame();
    }
  }, 1000);
});

// TIMER LOGIC
function startTimer() {
  const timer = setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
      timeDisplay.textContent = "Time Left: " + timeLeft;
    } else {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// END GAME FUNCTION
function endGame() {
  gameActive = false;
  button.disabled = true;
  message.textContent = "Game Over! Final Score: " + score;
  clearInterval(timer);
}
function startGame() {
  gameActive = true;
  button.disabled = false;

  score = 0;
  timeLeft = 10;

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: 10";

  startTimer();
}

