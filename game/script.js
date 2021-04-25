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
        makegameBox();
        this.interval = setInterval(this.updateGameArea, 20);
    },
    clear: function () {
        var _a;
        (_a = this.context) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    updateGameArea: function () {
        gameArea.clear();
        updateBoxPosition();
        moveObstacles();
    },
    stop: function () {
        clearInterval(this.interval);
        removeControls();
        showGameOverScreen();
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
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.initialX = x;
        this.initialY = y;
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
    retrieveInitialCordinates() {
        const x = this.initialX;
        const y = this.initialY;
        return [x, y];
    }
    moveUp() {
        this.speedY -= 1;
    }
    moveDown() {
        this.speedY += 1;
    }
    updatePosition() {
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
    reset() {
        this.clear();
        let initailCordinates = this.retrieveInitialCordinates();
        this.x = initailCordinates[0];
        this.y = initailCordinates[1];
        this.speedY = 0;
        this.updatePosition();
        this.draw();
    }
}
// assigning components
function makegameBox() {
    let verticalCenter = gameArea.canvas.height / 2;
    gameBox = new component(10, verticalCenter, "#000000", 20, 20);
    gameBox.draw();
}
function updateBoxPosition() {
    gameBox.updatePosition();
    gameBox.draw();
}
// game functions features and others
function startGame() {
    start_button === null || start_button === void 0 ? void 0 : start_button.remove();
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
function makeObstacles() {
    let minHeight = 40;
    let maxHeight = 100;
    let minWidth = 20;
    let maxWidth = 30;
    let height = minHeight + Math.random() * (maxHeight - minHeight + 1);
    let width = minWidth + Math.random() * (maxWidth - minWidth + 1);
    let x = gameArea.canvas.width;
    let y = gameArea.canvas.height - height;
    let randomIndex = Math.floor(Math.random() * 4);
    Obstacles.push(new component(x, 400, colors[randomIndex], width, 500));
    Obstacles.push(new component(x, 0, colors[randomIndex], width, height));
    Obstacles.forEach((obstacle) => obstacle.draw());
}
function randomGap() {
    let minGap = 80;
    let maxGap = 90;
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
            Obstacles.forEach((obstacle) => obstacle.clear());
        }
        Obstacles[i].x -= 2;
        if (Obstacles[i].y === 0) {
            Obstacles[i].height += Math.random() * 1;
        }
        else {
            Obstacles[i].y -= Math.random() * 1;
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
function restartGame() {
    gameArea.clear();
    removeGameOverScreen();
    gameArea.restart();
    addControls();
}
function gameOver() {
    let gameOver = false;
    Obstacles.forEach((obstacle) => {
        if (gameBox.crashWith(obstacle)) {
            gameOver = true;
        }
    });
    return gameOver;
}
// dom functions
function addControls() {
    controls.classList.replace("display-none", "controls");
}
function removeControls() {
    controls.classList.replace("controls", "display-none");
}
function showGameOverScreen() {
    gameArea.remove();
    gameOverScreen.classList.replace("display-none", "game-over-screen");
}
function removeGameOverScreen() {
    gameOverScreen.classList.replace("game-over-screen", "display-none");
}
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
    return;
}
// event listeners
document.addEventListener("keyup", (key) => handleKeyControls(key));
up_button.addEventListener("click", () => gameBox.moveUp());
down_button.addEventListener("click", () => gameBox.moveDown());
start_button.addEventListener("click", (button) => startGame());
restart_button.addEventListener("click", () => restartGame());
