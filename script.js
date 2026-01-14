// =====================
// CLICKERMANIA 2.0
// Built by Jaylon Montes 😎
// =====================

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

// Power-ups
let scoreBoost = false;
let timeFrozen = false;
let comboLock = false;

// Achievements
let achievements = JSON.parse(localStorage.getItem("achievements")) || {};

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
const styleToggle = document.getElementById("styleToggle");

// =====================
// UI STYLE
// =====================
let uiStyle = localStorage.getItem("uiStyle") || "flashy";
document.body.setAttribute("data-style", uiStyle);
styleToggle.textContent = uiStyle === "flashy" ? "🎨 UI: Flashy" : "🎨 UI: Clean";

styleToggle.onclick = () => {
  uiStyle = uiStyle === "flashy" ? "clean" : "flashy";
  document.body.setAttribute("data-style", uiStyle);
  localStorage.setItem("uiStyle", uiStyle);
  styleToggle.textContent = uiStyle === "flashy" ? "🎨 UI: Flashy" : "🎨 UI: Clean";
};

// =====================
// INIT
// =====================
highScoreDisplay.textContent = "High Score: " + highScore;
comboDisplay.textContent = "Combo: x1";

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
// MAIN BUTTON
// =====================
button.onclick = () => {
  if (gameState === "idle") {
    if (!nameLocked) {
      if (nameInput.value.trim() === "") {
        message.textContent = "⚠️ Enter your name first!";
        return;
      }
      playerName = nameInput.value;
      nameInput.disabled = true;
      nameLocked = true;
    }

    gameState = "countdown";
    button.disabled = true;
    message.textContent = "Get Ready...";
    startCountdown();
  }

  else if (gameState === "playing") {
    registerClick();
  }

  else if (gameState === "gameover") {
    resetGame();
  }
};

// =====================
// COUNTDOWN
// =====================
function startCountdown() {
  countdown = 3;
  message.textContent = countdown;

  const cd = setInterval(() => {
    countdown--;
    if (countdown > 0) message.textContent = countdown;
    else {
      clearInterval(cd);
      message.textContent = "GO!";
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
  button.textContent = "CLICK!";
  score = 0;
  combo = 0;
  timeLeft = getTimeLimit();
  updateUI();

  timer = setInterval(() => {
    if (!timeFrozen) timeLeft--;
    timeDisplay.textContent = "Time Left: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// =====================
// CLICK HANDLER
// =====================
function registerClick() {
  combo++;
  let gained = Math.floor(combo * getMultiplier());
  if (scoreBoost) gained *= 2;

  score += gained;
  updateUI();
  spawnPopup("+" + gained);

  clearTimeout(comboTimer);
  if (!comboLock) {
    comboTimer = setTimeout(() => {
      combo = 0;
      comboDisplay.textContent = "Combo: x1";
    }, getComboDecay());
  }

  maybeSpawnPowerup();
  checkAchievements();
}

// =====================
// POWER-UPS
// =====================
function maybeSpawnPowerup() {
  if (Math.random() < 0.1) {
    const type = ["score", "freeze", "combo"][Math.floor(Math.random() * 3)];
    activatePowerup(type);
  }
}

function activatePowerup(type) {
  if (type === "score") {
    scoreBoost = true;
    showMessage("⚡ 2× Score Boost!");
    setTimeout(() => scoreBoost = false, 5000);
  }
  if (type === "freeze") {
    timeFrozen = true;
    showMessage("❄️ Time Frozen!");
    setTimeout(() => timeFrozen = false, 3000);
  }
  if (type === "combo") {
    comboLock = true;
    showMessage("🔒 Combo Locked!");
    setTimeout(() => comboLock = false, 4000);
  }
}

// =====================
// ACHIEVEMENTS
// =====================
function unlock(name) {
  if (!achievements[name]) {
    achievements[name] = true;
    localStorage.setItem("achievements", JSON.stringify(achievements));
    showMessage("🏆 " + name + " unlocked!");
  }
}

function checkAchievements() {
  if (score >= 100) unlock("100 Points");
  if (combo >= 5) unlock("5x Combo");
}

// =====================
// END GAME
// =====================
function endGame() {
  clearInterval(timer);
  gameState = "gameover";
  button.textContent = "Play Again";

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("clickerHighScore", highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
    unlock("New High Score");
  }

  message.textContent = `Final Score: ${score}`;
}

// =====================
// RESET
// =====================
function resetGame() {
  gameState = "idle";
  button.textContent = "Start Game";
  message.textContent = "";
  nameInput.disabled = false;
  nameLocked = false;
  updateUI();
}

// =====================
// UI HELPERS
// =====================
function updateUI() {
  scoreDisplay.textContent = "Score: " + score;
  comboDisplay.textContent = "Combo: x" + combo;
  timeDisplay.textContent = "Time Left: " + timeLeft;
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    if (gameState === "playing") message.textContent = "";
  }, 1500);
}

function spawnPopup(text) {
  const popup = document.createElement("div");
  popup.className = "scorePopup";
  popup.textContent = text;
  popup.style.left = Math.random() * 80 + "%";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1000);
}
