const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let dx = 0;
let dy = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let changingDirection = false;

function main() {
    if (didGameEnd()) {
        alert("Game Over! Score: " + score);
        location.reload();
        return;
    }

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        main();
    }, 150);
}

function clearCanvas() {
    ctx.fillStyle = "rgba(15, 15, 15, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#00ffcc" : "#00aa88";
        ctx.shadowBlur = index === 0 ? 15 : 0;
        ctx.shadowColor = "#00ffcc";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = "#1a1a2e";
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    });
    ctx.shadowBlur = 0;
}

function advanceSnake() {
    if (dx === 0 && dy === 0) return;

    let nextX = snake[0].x + dx;
    let nextY = snake[0].y + dy;

    // Wrap around logic
    if (nextX < 0) nextX = tileCount - 1;
    else if (nextX > tileCount - 1) nextX = 0;
    if (nextY < 0) nextY = tileCount - 1;
    else if (nextY > tileCount - 1) nextY = 0;

    const head = { x: nextX, y: nextY };
    snake.unshift(head);

    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        document.getElementById('score').innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    if (dx === 0 && dy === 0) return false;
    
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    return false;
}

function createFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    snake.forEach(function isFoodOnSnake(part) {
        if (part.x == food.x && part.y == food.y) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = "#ff0077";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff0077";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.shadowBlur = 0;
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;

    if (keyPressed === LEFT_KEY && dx !== 1) {
        dx = -1; dy = 0;
    } else if (keyPressed === UP_KEY && dy !== 1) {
        dx = 0; dy = -1;
    } else if (keyPressed === RIGHT_KEY && dx !== -1) {
        dx = 1; dy = 0;
    } else if (keyPressed === DOWN_KEY && dy !== -1) {
        dx = 0; dy = 1;
    }
}

main();
