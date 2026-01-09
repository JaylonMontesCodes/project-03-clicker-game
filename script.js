// Project 03: Clicker Game
// Built by Jaylon Montes 😎

// =====================
// GAME STATE
// =====================
let score = 0;
let timeLeft = 10;
let gameActive = false;
let countdown = 3;
let playerName = "";
let gameStarted = false;
let timer = null;

// =====================
// ELEMENTS
// =====================
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const clickBtn = document.getElementById("clickBtn");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const nameInput = document.getElementById("playerName");

// =====================
// START BUTTON LOGIC 🎬
// =====================
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

// =====================
// CLICK BUTTON LOGIC 👆
// =====================
clickBtn.addEventListener("click", function () {
  if (gameActive && gameStarted) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
  }
});

// =====================
// TIMER LOGIC ⏱️
// =====================
function startTimer() {
  timer = setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
      timeDisplay.textContent = "Time Left: " + timeLeft;
    } else {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

// =====================
// START GAME
// =====================
function startGame() {
  gameActive = true;
  clickBtn.disabled = false;

  score = 0;
  timeLeft = 10;

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: 10";

  startTimer();
}

// =====================
// END GAME 🏁
// =====================
function endGame() {
  gameActive = false;
  clickBtn.disabled = true;

  message.textContent =
    "🎉 Congrats " + playerName + "! Final Score: " + score;
}
