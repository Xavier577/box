"use strict";
// selectors
const start_button = document.querySelector("[data-start-button]");
const controls = document.querySelector("[data-controls]");
const up_button = document.querySelector(".up");
const down_button = document.querySelector(".down");
const restart_button = document.querySelector("[data-restart]");
const gameOverScreen = document.querySelector("[data-game-over]");
const score = document.querySelector("[data-score]");
// component
let ctx; // the iconic ctx lol
let gameBox;
let Obstacles = [];
let colors = ["#ff0000", "#2b547a", "#00c210", "#4f128b"]; // colors for obstacles
// game Area
let gameArea = {
    canvas: document.createElement("canvas"),
    frameRate: 0,
    start: function () {
        createGameArea();
        gameBox.draw();
        makeObstacles();
        this.interval = setInterval(this.updateGameArea, 20);
    },
    clear: function () {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
    }
    draw() {
        ctx = gameArea.context;
        if (ctx === null)
            return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    clear() {
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(this.x, this.y, this.width, this.height);
    }
    moveUp() {
        this.speedY -= 0.5;
    }
    moveDown() {
        this.speedY += 0.5;
    }
    updatePosition() {
        this.clear();
        this.y += this.speedY;
        this.x += this.speedX;
        this.draw();
    }
    crashWith(obstacle) {
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
function startGame() {
    start_button.remove();
    gameArea.start();
    addControls();
}
function createGameArea() {
    gameArea.context = gameArea.canvas.getContext("2d");
    gameArea.canvas.width = 500;
    gameArea.canvas.height = 500;
    ctx = gameArea.context;
    if (ctx === null)
        return;
    ctx.fillStyle = "#e7e7e7";
    ctx.fillRect(0, 0, gameArea.canvas.width, gameArea.canvas.height);
    document.body.insertBefore(gameArea.canvas, document.body.childNodes[0]);
}
gameBox = new component(10, 120, "#000000", 20, 20);
function makeObstacles() {
    let minHeight = 40;
    let maxHeight = 100;
    let minWidth = 20;
    let maxWidth = 30;
    let height = minHeight + Math.random() * (maxHeight - minHeight + 1);
    let width = minWidth + Math.random() * (maxWidth - minWidth + 1);
    let x = gameArea.canvas.width;
    let y = gameArea.canvas.height - height;
    let randomIndex = Math.floor(Math.random() * 5);
    Obstacles.push(new component(x, 400, colors[randomIndex], width, 500));
    Obstacles.push(new component(x, 0, colors[randomIndex], width, height));
    Obstacles.forEach((obstacle) => obstacle.draw());
}
function randomGap() {
    let minGap = 80;
    let maxGap = 150;
    let gap = Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
    return gap;
}
function moveObstacles() {
    let gap = randomGap();
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
        }
        else {
            Obstacles[i].y -= Math.random() * 0.3;
        }
        Obstacles[i].draw();
    }
    gameArea.frameRate += 1;
}
function everyInterval(n) {
    if (gameArea.frameRate % n === 0) {
        return true;
    }
    return false;
}
function addControls() {
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
function handleKeyControls(key) {
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
