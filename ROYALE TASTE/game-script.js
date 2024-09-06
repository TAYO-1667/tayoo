let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let ballInterval;
let ballMovementInterval;
let gameStarted = false;
let ballCount = 0;
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-button');
const gameEndPopup = document.getElementById('game-end-popup');
const finalScoreDisplay = document.getElementById('final-score');
const difficultySelect = document.getElementById('difficulty');
const ballSound = new Audio('mixkit-game-ball-tap-2073.wav');
const endGameSound = new Audio('mixkit-player-losing-or-failing-2042.wav');

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    ballCount = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
    gameEndPopup.classList.remove('visible');

    const difficulty = difficultySelect.value;

    let createInterval = 1500;
    let moveInterval = 3000;
    let ballSize = 60;
    if (difficulty === 'easy') {
        createInterval = 1200;
        moveInterval = 2500;
        ballSize = 49;
    } else if (difficulty === 'medium') {
        createInterval = 800;
        moveInterval = 1850;
    } else if (difficulty === 'hard') {
        createInterval = 600;
        moveInterval = 1300;
    } else if (difficulty === 'intense') {
        createInterval = 400;
        moveInterval = 900;
    }

    ballInterval = setInterval(() => {
        createBall(ballSize);
    }, createInterval);

    ballMovementInterval = setInterval(() => {
        moveBalls();
    }, moveInterval);

    gameScreen.addEventListener('click', handleScreenClick);
}

function endGame() {
    clearInterval(ballInterval);
    clearInterval(ballMovementInterval);
    gameStarted = false;
    gameScreen.removeEventListener('click', handleScreenClick);
    document.querySelectorAll('.target').forEach(ball => ball.remove());
    updateHighScore();
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameEndPopup.classList.add('visible');
    endGameSound.play(); // Play end game sound
}

function createBall(ballSize = 60) {
    if (document.querySelectorAll('.target').length >= 12) {
        endGame();
        return;
    }
    const ball = document.createElement('div');
    ball.className = 'target';
    ball.style.width = `${ballSize}px`;
    ball.style.height = `${ballSize}px`;
    ball.style.backgroundImage = "url('images.jpg')"; // Use the logo as ball background
    ball.style.backgroundSize = 'cover';
    ball.style.position = 'absolute';
    ball.style.left = `${Math.random() * (gameScreen.clientWidth - ballSize)}px`;
    ball.style.top = `${Math.random() * (gameScreen.clientHeight - ballSize)}px`;
    ball.style.borderRadius = '50%';
    ball.style.cursor = 'pointer';
    ball.addEventListener('click', () => {
        ballSound.play();
        score += 1; // 1 point per click
        scoreDisplay.textContent = `Score: ${score}`;
        ball.remove();
        ballCount--;
    });
    gameScreen.appendChild(ball);
    ballCount++;
}

function moveBalls() {
    document.querySelectorAll('.target').forEach(ball => {
        ball.style.left = `${Math.random() * (gameScreen.clientWidth - ball.clientWidth)}px`;
        ball.style.top = `${Math.random() * (gameScreen.clientHeight - ball.clientHeight)}px`;
    });
}

function handleScreenClick(event) {
    if (!event.target.classList.contains('target')) {
        endGame(); // End game if clicking outside the ball
    }
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore);
    }
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    gameEndPopup.classList.remove('visible');
    startGame();
});

