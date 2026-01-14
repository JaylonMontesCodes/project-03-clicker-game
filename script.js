// =====================
// GAME STATE
// =====================
let score = 0;
let timeLeft = 10;
let countdown = 3;
let playerName = "";
let gameState = "idle";
let highScore = Number(localStorage.getItem("clickerHighScore")) || 0;
let combo = 0;
let comboTimer = null;
let timer = null;
let nameLocked = false;

// =====================
// UI STYLE 🎨
// =====================
const styleToggle = document.getElementById("styleToggle");

let uiStyle = localStorage.getItem("uiStyle") || "flashy";
document.body.setAttribute("data-style", uiStyle);
updateStyleButton();

styleToggle.addEventListener("click", () => {
  uiStyle = uiStyle === "flashy" ? "clean" : "flashy";
  localStorage.setItem("uiStyle", uiStyle);
  document.body.setAttribute("data-style", uiStyle);
  updateStyleButton();
});

function updateStyleButton() {
  styleToggle.textContent = uiStyle === "flashy"
    ? "🎨 UI Mode: Flashy ✨"
    : "🎨 UI Mode: Clean 🧼";
}

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

// =====================
// DIFFICULTY
// =====================
function getTimeLimit() {
  if (difficultySelect.value === "easy") return 15;
  if (difficultySelect.value === "hard") return 7;
  return 10;
}

function getComboDecay() {
  if (difficultySelect.value === "easy") return 1500;
  if (difficultySelect.value === "hard") return 500;
  return 1000;
}

function getMultiplier() {
  if (difficultySelect.value === "easy") return 1;
  if (difficultySelect.value === "hard") return 2;
  return 1.5;
}

// =====================
// MAIN BUTTON 🎮
// =====================
button.addEventListener("click", () => {

  if (gameState === "idle") {
    if (!nameLocked) {
      if (nameInput.value.trim() === "") {
        message.textContent = "⚠️ Please enter your name to start!";
        return;
      }

      playerName = nameInput.value;
      nameInput.disabled = true;
      nameLocked = true;
    }

    gameState = "countdown";
    button.disabled = true;
    message.textContent = "Get Ready... ⏱️";
    startCountdown();
  }

  else if (gameState === "playing") {
    combo++;
    score += Math.floor(combo * getMultiplier());

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

  else if (gameState === "gameover") {
    resetGame();
  }

});

// =====================
// COUNTDOWN
// =====================
function startCountdown() {
  countdown = 3;
  message.textContent = countdown;

  const cd = setInterval(() => {
    countdown--;

    if (countdown > 0) {
      message.textContent = countdown;
    } else {
      clearInterval(cd);
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
// END GAME
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
// RESET
// =====================
function resetGame() {
  gameState = "idle";
  button.textContent = "Start Game 🎬";
  message.textContent = "";

  nameInput.disabled = false;
  nameInput.value = "";
  nameLocked = false;

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: 10";
  comboDisplay.textContent = "Combo: x1";
}

