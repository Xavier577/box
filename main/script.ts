// selectors
const start_button = document.querySelector(
  "[data-start-button]"
) as HTMLElement;
const controls = document.querySelector("[data-controls]") as HTMLDivElement;
const up_button = document.querySelector(".up") as HTMLButtonElement;
const down_button = document.querySelector(".down") as HTMLButtonElement;
const restart_button = document.querySelector(
  "[data-restart]"
) as HTMLButtonElement;
const gameOverScreen = document.querySelector(
  "[data-game-over]"
) as HTMLDivElement;
const score = document.querySelector("[data-score]");
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
  /* 
  remove: Function; */
}
interface Component {
  x: number;
  y: number;
  color?: string;
  width: number;
  height: number;
  draw: Function;
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
let colors: string[] = ["#ff0000", "#2b547a", "#00c210", "#4f128b"]; // colors for obstacles

// game Area
let gameArea: Game = {
  canvas: document.createElement("canvas"),
  frameRate: 0,
  start: function () {
    createGameArea();
    gameBox.draw();
    makeObstacles();
    this.interval = setInterval(this.updateGameArea, 20);
  },
  clear: function () {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  updateGameArea: function () {
    gameArea.clear();
    gameBox.draw();
    gameBox.updatePosition();
    gameBox.draw();
    moveObstacles();
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

// class for creating components
class component {
  x: number;
  y: number;
  color: string;
  width: number;
  height: number;
  speedX: number;
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
    this.speedX = 0;
    this.speedY = 0;
  }
  public draw() {
    ctx = gameArea.context as CanvasRenderingContext2D;
    if (ctx === null) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  private clear() {
    ctx?.clearRect(this.x, this.y, this.width, this.height);
  }
  public moveUp() {
    this.speedY -= 0.5;
  }
  public moveDown() {
    this.speedY += 0.5;
  }
  public updatePosition() {
    this.clear();
    this.y += this.speedY;
    this.x += this.speedX;
    this.draw();
  }
  public crashWith(obstacle: Component) {
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
}

// game functions features and others

function startGame(): void {
  start_button.remove();
  gameArea.start();
  addControls();
}

function createGameArea(): void {
  gameArea.context = gameArea.canvas.getContext("2d");
  gameArea.canvas.width = 500;
  gameArea.canvas.height = 500;
  ctx = gameArea.context;
  if (ctx === null) return;
  ctx.fillStyle = "#e7e7e7";
  ctx.fillRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
  document.body.insertBefore(gameArea.canvas, document.body.childNodes[0]);
}

gameBox = new component(10, 120, "#000000", 20, 20);

function makeObstacles(): void {
  let minHeight: number = 40;
  let maxHeight: number = 100;
  let minWidth: number = 20;
  let maxWidth: number = 30;
  let height: number = minHeight + Math.random() * (maxHeight - minHeight + 1);
  let width: number = minWidth + Math.random() * (maxWidth - minWidth + 1);
  let x: number = gameArea.canvas.width;
  let y: number = gameArea.canvas.height - height;
  let randomIndex = Math.floor(Math.random() * 5);
  Obstacles.push(new component(x, 400, colors[randomIndex], width, 500));
  Obstacles.push(new component(x, 0, colors[randomIndex], width, height));
  Obstacles.forEach((obstacle) => obstacle.draw());
}

function randomGap(): number {
  let minGap: number = 80;
  let maxGap: number = 150;
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
    }
    Obstacles[i].x -= 1;
    if (Obstacles[i].y === 0) {
      Obstacles[i].height += Math.random() * 0.2;
    } else {
      Obstacles[i].y -= Math.random() * 0.3;
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

function addControls(): void {
  controls.classList.replace("display-none", "controls");
}

/* 

function removeControls() {
  controls.classList.replace("controls", "display-none");
}
function showGameOverScreen(): void {
  gameOverScreen.classList.replace("display-none", "game-over-screen");
}
function removeGameOverScreen() {
  gameOverScreen.classList.replace("game-over-screen", "display-none");
} */
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
  /* if (key.key === "ArrowLeft") {
    gameBox.moveLeft();
    return;
  }
  if (key.key === "ArrowRight") {
    gameBox.moveRight();
    return;
  } */
  return;
}

// event listeners

/* 
restart_button.addEventListener("click", () => {
  removeGameOverScreen();
  addControls();
});
*/

document.addEventListener("keydown", (key) => handleKeyControls(key), {
  once: false,
});
up_button.addEventListener("click", () => gameBox.moveUp(), { once: false });
down_button.addEventListener("click", () => gameBox.moveDown());
start_button.addEventListener("click", (button) => startGame());
