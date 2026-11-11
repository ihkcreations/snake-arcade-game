const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");  
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");
const startBtn = document.getElementById("start-btn");
const btnUp = document.getElementById("btn-up");
const btnDown = document.getElementById("btn-down");
const btnLeft = document.getElementById("btn-left");  
const btnRight = document.getElementById("btn-right");
const gridSize = 20;
const tileCount = 20;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;  
let nextDx = 0;
let nextDy = 0;
let score = 0;
let highScore = 0;
let gameInterval = null;
let isPlaying = false;
function init() {  
  highScore = localStorage.getItem("snake_high_score") || 0;
  highScoreEl.textContent = highScore;
  drawInitialBoard();
  startBtn.addEventListener("click", startGame);
  document.addEventListener("keydown", handleKeydown);
  btnUp.addEventListener("click", () => changeDirection(0, -1));
  btnDown.addEventListener("click", () => changeDirection(0, 1));  
  btnLeft.addEventListener("click", () => changeDirection(-1, 0));
  btnRight.addEventListener("click", () => changeDirection(1, 0));
}
function startGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },  
    { x: 8, y: 10 }
  ];
  score = 0;
  scoreEl.textContent = score;
  dx = 1;
  dy = 0;
  nextDx = 1;  
  nextDy = 0;
  spawnFood();
  overlay.classList.add("hidden");
  isPlaying = true;
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}  
function gameLoop() {
  dx = nextDx;
  dy = nextDy;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    endGame();
    return;  
  }
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }  
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;  
      localStorage.setItem("snake_high_score", highScore);
    }
    spawnFood();
  } else {
    snake.pop();
  }
  draw();  
}
function spawnFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === food.x && snake[i].y === food.y) {
      spawnFood();  
      break;
    }
  }
}
function changeDirection(newDx, newDy) {
  if (!isPlaying) return;
  if (newDx !== -dx || newDy !== -dy) {  
    nextDx = newDx;
    nextDy = newDy;
  }
}
function handleKeydown(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
    e.preventDefault();  
  }
  if (!isPlaying) {
    if (e.key === ' ' || e.key.startsWith('Arrow')) {
      startGame();
      return;
    }
  }  
  switch (e.key) {
    case "ArrowUp":
      changeDirection(0, -1);
      break;
    case "ArrowDown":
      changeDirection(0, 1);
      break;  
    case "ArrowLeft":
      changeDirection(-1, 0);
      break;
    case "ArrowRight":
      changeDirection(1, 0);
      break;
  }  
}
function endGame() {
  isPlaying = false;
  clearInterval(gameInterval);
  overlayTitle.textContent = "Game Over";
  overlayText.textContent = "Score: " + score;
  startBtn.textContent = "Play Again";  
  overlay.classList.remove("hidden");
}
function drawInitialBoard() {
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--surface-2");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function draw() {  
  ctx.fillStyle = getComputedStyle(canvas).getPropertyValue("--surface-2");
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  const textColor = getComputedStyle(document.documentElement).getPropertyValue("--text").trim();
  ctx.fillStyle = accentColor;
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 1, gridSize - 1);  
  }
  ctx.fillStyle = textColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}
init();


