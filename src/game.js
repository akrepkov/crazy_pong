import { movePaddles } from './controls.js';



export const canvas = document.getElementById('pong');
export const context = canvas.getContext('2d');
let balls = [];
let rgbColor = "white";
let animationId = null;
let winner = ""
let names1 = ["NullPointerPrince", "404NotFoundYou", "StackOverflowed",
	"CtrlAltElite", "CommitCrimes", "RubberDuckieDev", "PingMePlz", "BrbCompiling", "FatalSyntax",
	"BuggedButHappy", "InfiniteLoopHole", "SegFaultyLogic", "ByteMeMaybe", "SpaghettiCoder",
	"FullSnackDev", "KernelSandwich", "BoolinDev", "NaNStopper", "DevNullius",
	"TabbyTheDebugger", "LootBoxLad", "NoScopeCSharp", "Lagzilla", "RespawnResume", "CacheMeOutside"];
let names2 = ["AimBotany", "CrashTestCutie", "YeetCompiler",
	"PixelPuncher", "AFKChef", "TeaBagger3000", "CaffeineLoop", "RAMenNoodles",
	"404SnaccNotFound", "HelloWorldDomination", "JavaTheHutt",
	"WiFried", "DebuggerDuck", "ExceptionHunter", "TheRealSlimShader",
	"SyntaxTerror", "ClickyMcClickface", "BananaForScale", "Devzilla",
	"MrRobotoCallsHome", "SudoNym", "OopsIDidItAgain", "MemeDrivenDev",
	"TypoNinja", "BitFlipper"];
const randomIndex = Math.floor(Math.random() * names1.length);
let player1Name = names1[randomIndex];
let player2Name = names2[randomIndex];
let leftPlayerScore = 0;
let rightPlayerScore = 0;
let maxScore = 3;
let bombTimer = 0;
let lastTime = performance.now();


export function resetGame() {
	balls = [];
	rgbColor = "white";
	animationId = null;
	winner = ""
	leftPlayerScore = 0;
	rightPlayerScore = 0;
	maxScore = 3;
}
const bombSprite = new Image();
bombSprite.src = './src/danger.png';

class Bomb {
	constructor(dirX, dirY) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = dirX;
		this.speedY = dirY;

		// Sprite sheet properties
		this.frameWidth = 20;   // width of one frame in the sprite
		this.frameHeight = 20;  // height of one frame
		this.totalFrames = 4;  // number of frames in your sprite sheet
		this.currentFrame = 0;
		this.frameDelay = 8; // lower = faster animation
		this.frameCounter = 0;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;

		this.frameCounter++;
		if (this.frameCounter >= this.frameDelay) {
			this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
			this.frameCounter = 0;
		}
	}

	draw() {
		if (!bombSprite.complete) return;
		const sx = this.currentFrame * this.frameWidth;
		context.drawImage(
			bombSprite,
			sx, 0, this.frameWidth, this.frameHeight,
			this.x, this.y, this.frameWidth, this.frameHeight
		);
	}
}

class Ball {
	constructor(dirX, dirY, ballColor) {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = dirX;
		this.speedY = dirY;
		this.size = 20;
		this.color = ballColor;
	}
	update() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	drawBall() {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.size, this.size);
	}
	reset() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
		this.speedX = -this.speedX;
	}
}

export class Paddle {
	constructor(x) {
		this.height = 100;
		this.width = 10;
		this.x = x;
		this.y = (canvas.height - this.height) / 2;
		this.paddleSpeed = 10;
	}
	drawPaddle() {
		context.fillStyle = 'white';
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

export let leftPaddle = new Paddle(0);
export let rightPaddle = new Paddle(canvas.width - 10);
export let bomb = null;

function createBall(dirX, dirY, ballColor) {
	let ball = new Ball(dirX, dirY, ballColor);
	console.log("The ball is created: ", dirX, dirY, ballColor);
	balls.push(ball);
}

function checkBall(ball) {
	// Top/bottom wall collision
	if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
		ball.speedY = -ball.speedY;
	}
	// Left paddle collision
	if (ball.x <= leftPaddle.x + leftPaddle.width &&
		ball.y + ball.size >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
		ball.x = leftPaddle.x + leftPaddle.width;
		ball.speedX = -ball.speedX;
	}
	// Right paddle collision
	if (ball.x + ball.size >= rightPaddle.x &&
		ball.x <= rightPaddle.x + rightPaddle.width &&
		ball.y + ball.size >= rightPaddle.y &&
		ball.y <= rightPaddle.y + rightPaddle.height) {
		ball.x = rightPaddle.x - ball.size;
		ball.speedX = -ball.speedX;
	}
	if (ball.x <= 0) {
		rightPlayerScore++;
		ball.reset();
	}
	if (ball.x + ball.size >= canvas.width) {
		leftPlayerScore++;
		console.log("leftPlayerScore", leftPlayerScore);
		ball.reset();
	}
}

function checkBomb(bomb) {
	// Wall collision (top/bottom)
	if (bomb.y <= 0 || bomb.y + bomb.frameHeight >= canvas.height) {
		bomb.speedY = -bomb.speedY;
	}

	// Left paddle collision → remove bomb
	if (bomb.x <= leftPaddle.x + leftPaddle.width &&
		bomb.y + bomb.frameHeight >= leftPaddle.y &&
		bomb.y <= leftPaddle.y + leftPaddle.height) {
		console.log("Bomb hit left paddle!");
		rightPlayerScore++;
		bomb = null;
		return null;
	}

	// Right paddle collision → remove bomb
	if (bomb.x + bomb.frameWidth >= rightPaddle.x &&
		bomb.x <= rightPaddle.x + rightPaddle.width &&
		bomb.y + bomb.frameHeight >= rightPaddle.y &&
		bomb.y <= rightPaddle.y + rightPaddle.height) {
		console.log("Bomb hit right paddle!");
		leftPlayerScore++;
		bomb = null;
		return null;
	}

	return bomb;
}

function updateGameStatus() {
	const gameStatus = document.getElementById('gameStatusFrontend');
	gameStatus.innerHTML = `${leftPlayerScore} - ${rightPlayerScore}`; // Correct syntax
}


function gameLoop(currentTime) {
	const deltaTime = currentTime - lastTime;
	context.clearRect(0, 0, canvas.width, canvas.height);
	movePaddles();
	leftPaddle.drawPaddle();
	rightPaddle.drawPaddle();
	console.log (bombTimer);
	if (bomb === null) {
		bombTimer += deltaTime;
		if (bombTimer >= 3000) {
			bomb = new Bomb(getRandomDirection(), getRandomDirection());
			bombTimer = 0;
			lastTime = currentTime;
		}
	}
	if (bomb !== null) {
		bomb = checkBomb(bomb);
		if (bomb !== null) {
			bomb.update();
			bomb.draw();
		}
	}

	// Balls update
	for (const ball of balls) {
		ball.update();
		ball.drawBall();
		checkBall(ball);
	}

	updateGameStatus();

	// Game end condition
	if (leftPlayerScore >= maxScore || rightPlayerScore >= maxScore) {
		winner = (leftPlayerScore >= maxScore) ? player1Name : player2Name;
		document.getElementById("stopGame").click();
		return;
	}

	animationId = requestAnimationFrame(gameLoop);
}


function getRandomColor() {
	return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

function getRandomDirection() {
	const directionSign = Math.random() > 0.5 ? -1 : 1;
	return (Math.floor(Math.random() * 90) + 20) / 100 * directionSign;
}


export function handleStartGame(counter) {
	const gamePlayers = document.getElementById('players');
	gamePlayers.innerHTML = `
		<span>${player1Name}</span><span>${player2Name}</span>`;
	const ballCount = counter || 1;
	balls = [];
	if (ballCount === 1)
		createBall(1, 1, rgbColor);
	else {
		if (ballCount > 2)
			maxScore = 30;
		for (let i = 0; i < ballCount; i++) {
			rgbColor = getRandomColor();
			const dirX = getRandomDirection();
			const dirY = getRandomDirection();
			createBall(dirX, dirY, rgbColor);
		}
	}
	let currentTime = performance.now();
	gameLoop(currentTime);
}

export function handleStopGame() {
	console.log('Stopping game');
	if (animationId) {
		cancelAnimationFrame(animationId);
	}
	bomb = null;
	animationId = null;
	for (const ball of balls)
		ball.reset();
	leftPlayerScore = 0;
	rightPlayerScore = 0;
	maxScore = 3;
	updateGameStatus();
	context.clearRect(0, 0, canvas.width, canvas.height);
}