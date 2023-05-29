document.addEventListener("DOMContentLoaded", function () {
    // Get canvas element and 2D rendering context
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");
  
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 400;
  
    // Paddle object
    var paddleWidth = 10;
    var paddleHeight = 100;
    var player = {
      x: 10,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      color: "#fff",
      dy: 8, // paddle speed
      score: 0,
      upPressed: false,
      downPressed: false,
    };
    var computer = {
      x: canvas.width - paddleWidth - 10,
      y: canvas.height / 2 - paddleHeight / 2,
      width: paddleWidth,
      height: paddleHeight,
      color: "#fff",
      dy: 2.5, // paddle speed
      score: 0,
    };
  
    // Ball object
    var ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed: 4,
      dx: 4, // ball x-direction velocity
      dy: 4, // ball y-direction velocity
      color: "#fff",
    };
  
    // Keyboard event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
  
    function keyDownHandler(event) {
      switch (event.keyCode) {
        case 87: // W key
          player.upPressed = true;
          break;
        case 83: // S key
          player.downPressed = true;
          break;
      }
    }
  
    function keyUpHandler(event) {
      switch (event.keyCode) {
        case 87: // W key
          player.upPressed = false;
          break;
        case 83: // S key
          player.downPressed = false;
          break;
      }
    }
  
    // Update game state
    function update() {
      // Move player paddle
      if (player.upPressed && player.y > 0) {
        player.y -= player.dy;
      } else if (player.downPressed && player.y + player.height < canvas.height) {
        player.y += player.dy;
      }
  
      // Move computer paddle
      if (ball.y < computer.y + computer.height / 2 && computer.y > 0) {
        computer.y -= computer.dy;
      } else if (
        ball.y > computer.y + computer.height / 2 &&
        computer.y + computer.height < canvas.height
      ) {
        computer.y += computer.dy;
      }
  
      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;
  
      // Collisions with paddles
      if (
        ball.y + ball.radius > player.y &&
        ball.y - ball.radius < player.y + player.height &&
        ball.dx < 0
      ) {
        if (ball.x - ball.radius < player.x + player.width) {
          ball.dx *= -1;
        }
      }
  
      if (
        ball.y + ball.radius > computer.y &&
        ball.y - ball.radius < computer.y + computer.height &&
        ball.dx > 0
      ) {
        if (ball.x + ball.radius > computer.x) {
          ball.dx *= -1;
        }
      }
  
      // Collisions with walls
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }
  
      // Score points
      if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
      } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
      }
  
      // Update canvas
      drawCanvas();
    }
  
    // Reset ball position
    function resetBall() {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.dx *= -1;
      ball.dy *= Math.random() < 0.5 ? -1 : 1;
    }
  
    // Draw canvas
    function drawCanvas() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw paddles
      drawPaddle(player.x, player.y, player.width, player.height, player.color);
      drawPaddle(
        computer.x,
        computer.y,
        computer.width,
        computer.height,
        computer.color
      );
  
      // Draw ball
      drawBall(ball.x, ball.y, ball.radius, ball.color);
  
      // Draw scores
      ctx.fillStyle = "#fff";
      ctx.font = "30px Arial";
      ctx.fillText(player.score, canvas.width / 4, 50);
      ctx.fillText(computer.score, (canvas.width * 3) / 4, 50);
    }
  
    // Draw paddles
    function drawPaddle(x, y, width, height, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    }
  
    // Draw ball
    function drawBall(x, y, radius, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }
  
    // Game loop
    function gameLoop() {
      update();
      requestAnimationFrame(gameLoop);
    }
  
    // Start the game loop
    gameLoop();
  });
  