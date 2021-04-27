// selectors
const Score = document.querySelector("[data-score]") as HTMLSpanElement;
const controls = document.querySelector("[data-controls]") as HTMLDivElement;
const gameInfo = document.querySelector("[data-game-info]") as HTMLDivElement;
const closeGameInfo = document.querySelector("[data-close]") as HTMLSpanElement;
const gameOverScreen = document.querySelector(
  "[data-game-over]"
) as HTMLDivElement;
// buttons
const start_button = document.querySelector(
  "[data-start-button]"
) as HTMLButtonElement;
const help_button = document.querySelector("[data-help]") as HTMLButtonElement;
const up_button = document.querySelector(".up") as HTMLButtonElement;
const down_button = document.querySelector(".down") as HTMLButtonElement;
const restart_button = document.querySelector(
  "[data-restart]"
) as HTMLButtonElement;
// type structure
type Context = CanvasRenderingContext2D | null;

interface Game {
  canvas: HTMLCanvasElement;
  start: Function;
  context?: Context;
  updateGameArea: Function;
  clear: Function;
  interval?: number;
  frameRate: number;
  stop: Function;
  restart: Function;
  remove: Function;
}
interface Component {
  x: number;
  y: number;
  color?: string;
  width: number;
  height: number;
  draw: Function;
  clear: Function;
  reset: Function;
  moveUp: Function;
  moveDown: Function;
  updatePosition: Function;
  crashWith: Function;
  /*  
  moveLeft: Function;
  moveRight: Function; */
}

// component
let ctx: Context; // the iconic ctx lol
let gameBox: Component;
let Obstacles: Component[] = [];
let score: number = 0;
let colors: string[] = ["#ff0000", "#2b547a", "#00c210", "#4f128b"]; // colors for obstacles

// game Area
let gameArea: Game = {
  canvas: document.createElement("canvas"),
  frameRate: 0,
  start: function () {
    createGameArea();
    makegameBox();
    this.interval = setInterval(this.updateGameArea, 20);
  },
  clear: function () {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  updateGameArea: function () {
    gameArea.clear();
    updateBoxPosition();
    moveObstacles();
  },
  stop: function () {
    clearInterval(this.interval);
    removeControls();
    let gameOverSound = new sound("../assets/sounds/gameOver.mp3");
    gameOverSound.play();
    showGameOverScreen();
    score = Math.floor(score / (gameBox.x * 4));
    Score.innerText = score.toString();
  },
  restart: function () {
    Obstacles = [];
    gameBox.reset();
    this.start();
  },
  remove: function () {
    this.canvas.remove();
  },
};

// class for creating components
class component {
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  initialX: number;
  initialY: number;
  speedY: number;

  constructor(
    x: number,
    y: number,
    color: string,
    width: number,
    height: number
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.initialX = x;
    this.initialY = y;
    this.speedY = 0;
  }
  public draw(): void {
    ctx = gameArea.context as CanvasRenderingContext2D;
    if (ctx === null) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  public clear(): void {
    ctx?.clearRect(this.x, this.y, this.width, this.height);
  }
  private retrieveInitialCordinates(): number[] {
    const x = this.initialX;
    const y = this.initialY;
    return [x, y];
  }
  public moveUp() {
    this.speedY -= 1;
  }
  public moveDown() {
    this.speedY += 1;
  }
  public updatePosition(): void {
    this.clear();
    if (this.y <= 0) {
      this.speedY = 0;
      this.moveDown();
    }
    if (this.y >= gameArea.canvas.height - this.height) {
      this.speedY = 0;
      this.moveUp();
    }
    this.y += this.speedY;
  }
  public crashWith(obstacle: Component): boolean {
    // box properties
    let boxLeft = this.x;
    let boxRight = this.x + this.width;
    let boxTop = this.y;
    let boxBottom = this.y + this.height;
    // obstacle properties
    let obstaclesLeft = obstacle.x;
    let obstacleRight = obstacle.x + obstacle.width;
    let obstacleTop = obstacle.y;
    let obstacleBottom = obstacle.y + obstacle.height;
    let crash = true;
    boxBottom < obstacleTop ||
    boxTop > obstacleBottom ||
    boxRight < obstaclesLeft ||
    boxLeft > obstacleRight
      ? (crash = false)
      : null;
    return crash;
  }
  public reset(): void {
    this.clear();
    let initailCordinates = this.retrieveInitialCordinates();
    this.x = initailCordinates[0];
    this.y = initailCordinates[1];
    this.speedY = 0;
    this.updatePosition();
    this.draw();
  }
}

// for game sounds
class sound {
  sound: HTMLAudioElement;

  constructor(src: string) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.addSound();
  }
  public addSound() {
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  public play() {
    this.sound.play();
  }
  public stop() {
    this.sound.pause();
  }
}
// assigning components
function makegameBox() {
  let verticalCenter: number = gameArea.canvas.height / 2;
  gameBox = new component(10, verticalCenter, "#000000", 20, 20);
  gameBox.draw();
}
function updateBoxPosition() {
  gameBox.updatePosition();
  gameBox.draw();
}

// game functions features and others

function startGame(): void {
  let startSound = new sound("../assets/sounds/startGame.wav");
  start_button.remove();
  help_button.remove();
  gameArea.start();
  addControls();
  startSound.play();
}

function createGameArea(): void {
  gameArea.context = gameArea.canvas.getContext("2d");
  gameArea.canvas.width = 500;
  gameArea.canvas.height = 500;
  ctx = gameArea.context;
  if (ctx === null) return;
  ctx.fillStyle = "#e7e7e7";
  ctx.fillRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
  document.body.insertBefore(gameArea.canvas, document.body.childNodes[3]);
}

function makeObstacles(): void {
  let minHeight: number = 40;
  let maxHeight: number = 100;
  let minWidth: number = 20;
  let maxWidth: number = 30;
  let height: number = minHeight + Math.random() * (maxHeight - minHeight + 1);
  let width: number = minWidth + Math.random() * (maxWidth - minWidth + 1);
  let x: number = gameArea.canvas.width;
  let y: number = gameArea.canvas.height - height;
  let randomIndex = Math.floor(Math.random() * 4);
  Obstacles.push(new component(x, 400, colors[randomIndex], width, 500));
  Obstacles.push(new component(x, 0, colors[randomIndex], width, height));
  Obstacles.forEach((obstacle) => obstacle.draw());
}

function randomGap(): number {
  let minGap: number = 80;
  let maxGap: number = 90;
  let gap: number = Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
  return gap;
}
function moveObstacles(): void {
  let gap: number = randomGap();
  if (everyInterval(gap)) {
    console.log(gap);
    makeObstacles();
    gap = randomGap();
    gameArea.frameRate = 0;
  }
  for (let i = 0; i < Obstacles.length; i++) {
    if (gameBox.crashWith(Obstacles[i])) {
      gameArea.stop();
      Obstacles.forEach((obstacle) => obstacle.clear());
    }
    Obstacles[i].x -= 2;
    score += 1;
    if (Obstacles[i].y === 0) {
      Obstacles[i].height += Math.random() * 1;
    } else {
      Obstacles[i].y -= Math.random() * 1;
    }
    Obstacles[i].draw();
  }
  gameArea.frameRate += 1;
}

function everyInterval(n: number): boolean {
  if (gameArea.frameRate % n === 0) {
    return true;
  }
  return false;
}

function restartGame() {
  gameArea.clear();
  removeGameOverScreen();
  gameArea.restart();
  addControls();
  score = 0;
  help_button?.classList.replace("display-none", "help");
}

function showGameInstructions() {
  gameInfo.classList.replace("display-none", "game-instructions");
  start_button.style.display = "none";
  help_button.style.display = "none";
}
function closeInstructions() {
  gameInfo.classList.replace("game-instructions", "display-none");
  start_button.style.display = "inline";
  help_button.style.display = "inline";
}

// dom functions
function addControls(): void {
  controls.classList.replace("display-none", "controls");
}
function removeControls() {
  controls.classList.replace("controls", "display-none");
}
function showGameOverScreen(): void {
  gameArea.remove();
  gameOverScreen.classList.replace("display-none", "game-over-screen");
  help_button?.classList.replace("help", "display-none");
}
function removeGameOverScreen() {
  gameOverScreen.classList.replace("game-over-screen", "display-none");
}

// controls logic
function handleKeyControls(key: KeyboardEvent): void {
  if (key.key === "ArrowUp") {
    gameBox.moveUp();
    return;
  }
  if (key.key === "ArrowDown") {
    gameBox.moveDown();
    return;
  }
  return;
}

// event listeners
document.addEventListener("keyup", (key) => handleKeyControls(key));
up_button.addEventListener("click", () => gameBox.moveUp());
down_button.addEventListener("click", () => gameBox.moveDown());
start_button.addEventListener("click", (button) => startGame());
help_button.addEventListener("click", (button) => showGameInstructions());
closeGameInfo.addEventListener("click", () => closeInstructions());
restart_button.addEventListener("click", () => restartGame());
