// selectors
const button = document.querySelector("#start-button") as HTMLElement;
const controls = document.querySelector(".display-none") as HTMLDivElement;
const up_button = document.querySelector(".up") as HTMLButtonElement;
const down_button = document.querySelector(".down") as HTMLButtonElement;
// type structure
type Context = CanvasRenderingContext2D | null;

interface Game {
  canvas: HTMLCanvasElement;
  start: Function;
  context?: Context;
  interval: number;
  frameRate: number;
  clear: Function;
  stop: Function;
}
interface Component {
  x: number;
  y: number;
  color?: string;
  width: number;
  height: number;
  draw: Function;
  updatePosition: Function;
  moveUP: Function;
  moveDown: Function;
  crashWith: Function;
  moveLeft: Function;
  moveRight: Function;
}

// game area and component
let ctx: Context; // the iconic ctx lol

// components
let gameBox: Component;

// Obstacles
let Obstacles: Component[];
let redObstacle: component;
let blueObstacle: component;
let greenObstacle: component;
let purpleObstacle: component;

let gameArea: Game = {
  canvas: document.createElement("canvas"),
  interval: setInterval(updateGameArea, 20),
  frameRate: 0,
  start: function () {
    this.canvas.width = 600;
    this.canvas.height = 550;
    this.context = this.canvas.getContext("2d");
    ctx = this.context;
    if (ctx == undefined) return;
    ctx.fillStyle = "#e9e8e8";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameRate = 0;
    this.interval;
  },
  clear: function () {
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  },
};

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
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = 0;
    this.speedY = 0;
  }
  draw() {
    ctx = gameArea.context as Context;
    if (ctx == undefined) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  updatePosition() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  moveUP() {
    this.speedY -= 1;
  }
  moveDown() {
    this.speedY += 1;
  }
  crashWith(obstacle: Component) {
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
  moveLeft() {
    this.speedX -= 1;
  }
  moveRight() {
    this.speedX += 1;
  }
}

gameBox = new component(10, 250, "black", 30, 30);
let colors: string[] = ["#ff0000", "#2b547a", "#00c210", "#4f128b"];
redObstacle = new component(90, 0, colors[0], 30, 150);
blueObstacle = new component(150, 450, colors[1], 30, 550);
greenObstacle = new component(300, 450, colors[2], 30, 550);
purpleObstacle = new component(400, 0, colors[3], 30, 300);
Obstacles = [redObstacle, blueObstacle, greenObstacle, purpleObstacle];
//Math.floor(Math.random() * 4)

// function that starts the game with the needed components
function startGame(): void {
  gameArea.start();
  gameBox.draw();
  Obstacles.forEach((obstacle) => obstacle.draw());
  button.remove();
}
function updateGameArea(): void {
  gameArea.clear();
  gameBox.updatePosition();
  gameBox.draw();
  Obstacles.forEach((obstacle) => {
    if (gameBox.crashWith(obstacle)) {
      gameArea.stop();
    }
    // obstacle.x -= 1;
    obstacle.draw();
  });
}

// controls logic
function handleKeyControls(key: KeyboardEvent): void {
  if (key.key === "ArrowUp") {
    gameBox.moveUP();
    return;
  }
  if (key.key === "ArrowDown") {
    gameBox.moveDown();
    return;
  }
  if (key.key === "ArrowLeft") {
    gameBox.moveLeft();
    return;
  }
  if (key.key === "ArrowRight") {
    gameBox.moveRight();
    return;
  }
  return;
}

// event listeners

document.addEventListener("keyup", (key) => handleKeyControls(key));
button.addEventListener("click", (button) => {
  startGame();
  controls.classList.add("controls");
  controls.classList.remove(".display-none");
});
up_button.addEventListener("click", () => gameBox.moveUP());
down_button.addEventListener("click", () => gameBox.moveDown());
