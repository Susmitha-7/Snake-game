const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let interval;

function setup() {
  snake = new Snake();
  food = randomPosition();
  score = 0;
  scoreDisplay.textContent = score;

  clearInterval(interval);
  interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, scale, scale);

    if (snake.eat(food)) {
      score += 10;
      scoreDisplay.textContent = score;
      food = randomPosition();
    }

    if (snake.checkCollision()) {
      alert("Game Over! Your score was: " + score);
      resetGame();
    }
  }, 150);
}

function resetGame() {
  setup();
}

function Snake() {
  this.body = [{ x: scale * 5, y: scale * 5 }];
  this.xSpeed = scale;
  this.ySpeed = 0;

  this.draw = function () {
    ctx.fillStyle = "lime";
    for (let part of this.body) {
      ctx.fillRect(part.x, part.y, scale, scale);
    }
  };

  this.update = function () {
    const head = { x: this.body[0].x + this.xSpeed, y: this.body[0].y + this.ySpeed };
    this.body.unshift(head);
    this.body.pop();
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case "Up":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case "Down":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case "Left":
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case "Right":
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function (food) {
    const head = this.body[0];
    if (head.x === food.x && head.y === food.y) {
      this.body.push({});
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    return head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0;
  };
}

function randomPosition() {
  const x = Math.floor(Math.random() * columns) * scale;
  const y = Math.floor(Math.random() * rows) * scale;
  return { x, y };
}

window.addEventListener("keydown", e => {
  const direction = e.key.replace("Arrow", "");
  snake.changeDirection(direction);
});

setup();
