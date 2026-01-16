let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
let highScore = localStorage.getItem("clickerHighScore") || 0;

let score = 0;
let timeLeft = 10;
let gameState = "idle";
let timer = null;
let clickStreak = 0;
let lastClickTime = 0;

/* Elements */
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const comboDisplay = document.getElementById("combo");
const highScoreDisplay = document.getElementById("highScore");
const button = document.getElementById("gameBtn");
const message = document.getElementById("message");
const nameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");
const styleToggle = document.getElementById("styleToggle");

/* Style toggle */
styleToggle.onclick = () => {
  const style = document.body.getAttribute("data-style");
  document.body.setAttribute("data-style", style === "flashy" ? "clean" : "flashy");
};

/* Difficulty */
function getTimeLimit() {
  if (difficultySelect.value === "easy") return 15;
  if (difficultySelect.value === "hard") return 7;
  return 10;
}

function getMultiplier() {
  if (clickStreak >= 20) return 4;
  if (clickStreak >= 10) return 3;
  if (clickStreak >= 5) return 2;
  return 1;
}

/* Button */
button.onclick = () => {
  if (gameState === "idle") startGame();
  else if (gameState === "playing") registerClick();
  else resetGame();
};

function startGame() {
  score = 0;
  clickStreak = 0;
  timeLeft = getTimeLimit();
  gameState = "playing";

  button.textContent = "CLICK!";
  message.textContent = "";

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = "Time Left: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function registerClick() {
  const now = Date.now();
  clickStreak = (now - lastClickTime < 1200) ? clickStreak + 1 : 1;
  lastClickTime = now;

  const gained = getMultiplier();
  score += gained;

  scoreDisplay.textContent = "Score: " + score;
  comboDisplay.textContent = "Combo: x" + getMultiplier();

  spawnPopup("+" + gained);
}

function spawnPopup(text) {
  const p = document.createElement("div");
  p.className = "scorePopup";
  p.textContent = text;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 900);
}

function endGame() {
  clearInterval(timer);
  gameState = "gameover";
  button.textContent = "Play Again";
  message.textContent = "Final Score: " + score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("clickerHighScore", highScore);
  }

  saveScore(nameInput.value || "Anonymous", score);
}

function resetGame() {
  gameState = "idle";
  button.textContent = "Start Game 🎬";
  message.textContent = "";
}

/* ===== LEADERBOARD ===== */
function saveScore(name, score) {
  const existing = leaderboard.find(p => p.name === name);
  if (existing) {
    if (score > existing.score) existing.score = score;
  } else {
    leaderboard.push({ name, score });
  }

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const board = document.getElementById("leaderboard");
  if (!leaderboard.length) {
    board.innerHTML += "<p>No scores yet</p>";
    return;
  }

  board.innerHTML = leaderboard
    .map((p, i) => `<p>#${i + 1} ${p.name} — ${p.score}</p>`)
    .join("");
}

highScoreDisplay.textContent = "High Score: " + highScore;
renderLeaderboard();
