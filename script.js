// Project 03: ClickerMania
// Built by Jaylon Montes 😎

// =====================
// GAME STATE
// =====================
let score = 0;
let timeLeft = 10;
let countdown = 3;
let playerName = "";
let gameState = "idle"; // idle → countdown → playing → gameover
let highScore = Number(localStorage.getItem("clickerHighScore")) || 0;
let combo = 0;
let comboTimer = null;
let timer = null;

// =====================
// SOUNDS 🔊
// =====================
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

clickSound.volume = 0.5;
winSound.volume = 0.7;

// =====================
// ELEMENTS
// =====================
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const button = document.getElementById("gameBtn");
const message = document.getElementById("message");
const nameInput = document.getElementById("playerName");
const highScoreDisplay = document.getElementById("highScore");
const comboDisplay = document.getElementById("combo");
const difficultySelect = document.getElementById("difficulty");

highScoreDisplay.textContent = "High Score: " + highScore;
comboDisplay.textContent = "Combo: x1";

// =====================
// DIFFICULTY HELPERS
// =====================
function getTimeLimit() {
  if (difficultySelect.value === "easy") return 15;
  if (difficultySelect.value === "hard") return 7;
  return 10; // moderate
}

function getComboDecay() {
  if (difficultySelect.value === "easy") return 1500;
  if (difficultySelect.value === "hard") return 500;
  return 1000; // moderate
}

// =====================
// MAIN BUTTON LOGIC 🎮
// =====================
button.addEventListener("click", () => {

  // START GAME
  if (gameState === "idle") {
    if (nameInput.value.trim() === "") {
      alert("Please enter your name 🙂");
      return;
    }

    playerName = nameInput.value;
    nameInput.disabled = true;

    gameState = "countdown";
    button.disabled = true;
    message.textContent = "Get Ready... ⏱️";

    startCountdown();
  }

  // GAMEPLAY CLICK
  else if (gameState === "playing") {
    combo++;
    score += combo;

    scoreDisplay.textContent = "Score: " + score;
    comboDisplay.textContent = "Combo: x" + combo;

    clickSound.currentTime = 0;
    clickSound.play();

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
      combo = 0;
      comboDisplay.textContent = "Combo: x1";
    }, getComboDecay());
  }

  // PLAY AGAIN
  else if (gameState === "gameover") {
    resetGame();
  }
});

// =====================
// COUNTDOWN ⏱️
// =====================
function startCountdown() {
  countdown = 3;
  message.textContent = countdown;

  const countdownTimer = setInterval(() => {
    countdown--;

    if (countdown > 0) {
      message.textContent = countdown;
    } else {
      clearInterval(countdownTimer);
      message.textContent = "GO! 🚀";
      startGame();
    }
  }, 1000);
}

// =====================
// START GAME
// =====================
function startGame() {
  gameState = "playing";
  button.disabled = false;
  button.textContent = "CLICK ME!";

  score = 0;
  combo = 0;
  comboDisplay.textContent = "Combo: x1";

  timeLeft = getTimeLimit();

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: " + timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = "Time Left: " + timeLeft;

    if (timeLeft === 0) {
      endGame();
    }
  }, 1000);
}

// =====================
// END GAME 🏁
// =====================
function endGame() {
  clearInterval(timer);
  gameState = "gameover";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("clickerHighScore", highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
    message.textContent = `🏆 NEW RECORD ${playerName}! Score: ${score}`;
  } else {
    message.textContent = `🎉 Nice job ${playerName}! Score: ${score}`;
  }

  winSound.currentTime = 0;
  winSound.play();

  button.textContent = "Play Again 🔁";
}

// =====================
// RESET GAME 🔄
// =====================
function resetGame() {
  gameState = "idle";
  button.textContent = "Start Game 🎬";
  message.textContent = "";

  nameInput.disabled = false;
  nameInput.value = "";

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: 10";
  comboDisplay.textContent = "Combo: x1";
}

