let score = 0;
let timeLeft = 10;
let gameState = "idle";
let highScore = localStorage.getItem("clickerHighScore") || 0;
let clickStreak = 0;
let lastClickTime = 0;

let scoreBoost = false;
let timeFrozen = false;
let comboLock = false;

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const button = document.getElementById("gameBtn");
const message = document.getElementById("message");
const nameInput = document.getElementById("playerName");
const highScoreDisplay = document.getElementById("highScore");
const comboDisplay = document.getElementById("combo");
const difficultySelect = document.getElementById("difficulty");
const styleToggle = document.getElementById("styleToggle");

let uiStyle = localStorage.getItem("uiStyle") || "flashy";
document.body.setAttribute("data-style", uiStyle);

styleToggle.onclick = () => {
  uiStyle = uiStyle === "flashy" ? "clean" : "flashy";
  document.body.setAttribute("data-style", uiStyle);
  localStorage.setItem("uiStyle", uiStyle);
};

highScoreDisplay.textContent = "High Score: " + highScore;

function getTimeLimit() {
  return difficultySelect.value === "easy" ? 15 :
         difficultySelect.value === "hard" ? 7 : 10;
}

function getMultiplier() {
  return difficultySelect.value === "hard" ? 1.5 : 1;
}

function getStreakMultiplier() {
  if (clickStreak >= 20) return 4;
  if (clickStreak >= 10) return 3;
  if (clickStreak >= 5) return 2;
  return 1;
}

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
    if (!timeFrozen) timeLeft--;
    timeDisplay.textContent = "Time Left: " + timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function registerClick() {
  const now = Date.now();

  if (now - lastClickTime < 1200 || comboLock) clickStreak++;
  else clickStreak = Math.max(1, clickStreak - 2);

  lastClickTime = now;

  let gained = Math.floor(getStreakMultiplier() * getMultiplier() * (scoreBoost ? 2 : 1));
  score += gained;

  comboDisplay.textContent = "Combo: x" + getStreakMultiplier();
  scoreDisplay.textContent = "Score: " + score;

  spawnPopup("+" + gained);
  maybeSpawnPowerup();
}

function maybeSpawnPowerup() {
  if (Math.random() < 0.1) {
    const p = ["score","freeze","combo"][Math.floor(Math.random()*3)];
    if (p === "score") { scoreBoost=true; message.textContent="⚡ Score Boost!"; setTimeout(()=>scoreBoost=false,5000); }
    if (p === "freeze") { timeFrozen=true; message.textContent="❄️ Time Frozen!"; setTimeout(()=>timeFrozen=false,3000); }
    if (p === "combo") { comboLock=true; message.textContent="🔒 Combo Lock!"; setTimeout(()=>comboLock=false,4000); }
  }
}

let popupActive=false;
function spawnPopup(text) {
  if (popupActive) return;
  popupActive=true;

  const p=document.createElement("div");
  p.className="scorePopup";
  p.textContent=text;
  document.body.appendChild(p);

  setTimeout(()=>{p.remove();popupActive=false},900);
}

function endGame() {
  clearInterval(timer);
  gameState="gameover";
  button.textContent="Play Again";
  message.textContent="Final Score: "+score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("clickerHighScore", highScore);
    highScoreDisplay.textContent = "High Score: " + highScore;
  }
}

function resetGame() {
  gameState="idle";
  button.textContent="Start Game";
  message.textContent="";
}
