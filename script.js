const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width;
let height;

let mousedown = false;
let mouseX = 0;
let mouseY = 0;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function randColor() {
  return "#" + (~~(Math.random() * 0xffffff)).toString(16);
}

function toHex(x, y) {
  x = ~~((x / window.innerWidth) * 255 * 10) % 255;
  y = ~~((y / window.innerHeight) * 255 * 10) % 255;

  let hex = ((x << 16) | (y << 8) | 100).toString(16);
  return "#" + Array(7 - hex.length).join("0") + hex;
}

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
}

resizeCanvas();

class Ball {
  constructor(x, y, dx, dy, size, color) {
    Object.assign(this, { x, y, dx, dy, size, color });
  }

  step(dt) {
    if (
      (this.x - this.size < 0 && this.dx < 0) ||
      (this.x + this.size > width && this.dx > 0)
    ) {
      this.dx = -this.dx / 1.5;
    }

    if (
      (this.y - this.size < 0 && this.dy < 0) ||
      (this.y + this.size > height && this.dy > 0)
    ) {
      this.dy = -this.dy / 1.5;
    }

    this.x += this.dx * dt;
    this.y += this.dy * dt;
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

let timer = 0;

function step(balls, dt) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.01)";
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    let ball = balls[i];
    ball.color = toHex(ball.x, ball.y);

    if (mousedown) {
      ball.dx += (mouseX - ball.x) * dt;
      ball.dy += (mouseY - ball.y) * dt;
    }

    ball.step(dt);
    ball.render();
  }
}

let balls = Array.from(
  { length: 1000 },
  () =>
    new Ball(
      width / 2,
      height / 2,
      Math.random() * 1000 - 500,
      Math.random() * 1000 - 500,
      5,
      randColor()
    )
);
let prevt = 0;

function animate() {
  let dt = performance.now() - prevt;
  timer += dt;
  step(balls, dt / 1000);
  prevt = performance.now();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

canvas.onmousedown = (event) => {
  mousedown = true;
  mouseX = event.x;
  mouseY = event.y;
};

canvas.onmousemove = (event) => {
  mouseX = event.x;
  mouseY = event.y;
};

canvas.onmouseup = () => {
  mousedown = false;
};

console.log(toHex(12, 233));

animate();
