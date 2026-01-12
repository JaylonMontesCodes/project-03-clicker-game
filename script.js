// Project 03: Clicker Game
// Built by Jaylon Montes 😎

// =====================
// GAME STATE
// =====================
let score = 0;
let timeLeft = 10;
let countdown = 3;
let playerName = "";
let gameState = "idle"; 
let highScore = localStorage.getItem("clickerHighScore") || 0;
// idle → countdown → playing → gameover

let timer = null;

// =====================
// SOUNDS 🔊
// =====================
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

// =====================
// ELEMENTS
// =====================
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const button = document.getElementById("gameBtn");
const message = document.getElementById("message");
const nameInput = document.getElementById("playerName");

// =====================
// MAIN BUTTON LOGIC 🎮
// =====================
button.addEventListener("click", function () {

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

  // CLICKING GAMEPLAY
  else if (gameState === "playing") {
  score++;
  scoreDisplay.textContent = "Score: " + score;

  // 🔊 click sound
  clickSound.currentTime = 0;
  clickSound.play();
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
  timeLeft = 10;

  scoreDisplay.textContent = "Score: 0";
  timeDisplay.textContent = "Time Left: 10";

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

  winSound.currentTime = 0;
  winSound.play();

  button.textContent = "Play Again 🔁";
  message.textContent = `🎉 Congrats ${playerName}! Final Score: ${score}`;
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
}
// =====================
// 🔊 SOUND SYSTEM (Ready for later)
// =====================
const clickSound = new Audio("sounds/click.mp3");
const winSound = new Audio("sounds/win.mp3");

// Prevent sound stacking
clickSound.volume = 0.5;
winSound.volume = 0.7;
