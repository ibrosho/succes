const canvas = document.getElementById('runnerCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const coinsElement = document.getElementById('coins');
const gameOverScreen = document.getElementById('game-over');
const menuOverlay = document.getElementById('menu-overlay');
const startBtn = document.getElementById('start-btn');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let laneWidth = (canvas.width || 800) / 3;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    laneWidth = (canvas.width || 800) / 3;
});

if (canvas.width === 0) {
    canvas.width = window.innerWidth || 800;
    canvas.height = window.innerHeight || 600;
}

let score = 0;
let collectedCoins = 0;
let gameSpeed = 10;
let isGameOver = false;
let isPaused = false;
let gameStarted = false;

// Load Images
const bgImg = new Image();
bgImg.src = 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const playerImg = new Image();
playerImg.src = 'https://img.icons8.com/color/96/running--v1.png';
const obstacleImg = new Image();
obstacleImg.src = 'https://img.icons8.com/color/96/sofa.png';
const carImg = new Image();
carImg.src = 'https://img.icons8.com/color/96/vacuum-cleaner.png';
const highImg = new Image();
highImg.src = 'https://img.icons8.com/color/96/chandelier.png';
const coinImg = new Image();
coinImg.src = 'https://img.icons8.com/color/96/coin.png';
const magnetImg = new Image();
magnetImg.src = 'https://img.icons8.com/color/96/magnet.png';
const jetpackImg = new Image();
jetpackImg.src = 'https://img.icons8.com/color/96/jetpack.png';
const mysteryBoxImg = new Image();
mysteryBoxImg.src = 'https://img.icons8.com/color/96/gift--v1.png';

let bgY = 0;

class Player {
    constructor() {
        this.lane = 1; // 0: Left, 1: Center, 2: Right
        this.width = 100;
        this.height = 100;
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.y = canvas.height - 200;
        this.isJumping = false;
        this.jumpTimer = 0;
        this.scale = 1;
        this.isSliding = false;
        this.slideTimer = 0;
        this.jetpackTimer = 0;
        this.magnetTimer = 0;
        this.scoreMultiplier = 1;
        this.multiplierTimer = 0;
        this.particles = [];
    }

    createParticles() {
        const count = this.jetpackTimer > 0 ? 5 : 2;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height - 10,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2,
                life: 1.0
            });
        }
    }

    drawParticles() {
        ctx.fillStyle = this.jetpackTimer > 0 ? '#ffaa00' : 'rgba(255, 255, 255, 0.6)';
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    draw() {
        // Hide shadow if high in jetpack
        if (this.jetpackTimer > 10) ctx.globalAlpha = 0.2;

        // Ground shadow for realism - scales with jump
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height - 5, 40 * this.scale, 15 * this.scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();
        ctx.globalAlpha = 1.0;

        this.drawParticles();

        // Character sprite
        let drawW = this.width * this.scale;
        let drawH = this.height * this.scale;
        if (this.isSliding) drawH *= 0.6; // Compress for slide

        ctx.drawImage(playerImg, this.x - (drawW - this.width) / 2, this.y + (this.height - drawH), drawW, drawH);
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpTimer = 30; // duration of jump in frames
        }
    }

    slide() {
        if (!this.isJumping && !this.isSliding) {
            this.isSliding = true;
            this.slideTimer = 40;
        }
    }

    update() {
        // Smoothly move to target lane
        const targetX = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.x += (targetX - this.x) * 0.2;

        if (this.jetpackTimer > 0) {
            this.jetpackTimer--;
            this.scale = 1.8;
            this.y = 100; // Fly high
        } else if (this.isJumping) {
            this.y = canvas.height - 200;
            this.jumpTimer--;
            this.scale = 1 + Math.sin((this.jumpTimer / 30) * Math.PI) * 0.5;
            if (this.jumpTimer <= 0) {
                this.isJumping = false;
                this.scale = 1;
            }
        } else if (this.isSliding) {
            this.y = canvas.height - 200;
            this.slideTimer--;
            if (this.slideTimer <= 0) this.isSliding = false;
        } else {
            this.y = canvas.height - 200;
            this.scale = 1;
        }

        if (this.magnetTimer > 0) this.magnetTimer--;
        this.createParticles();

        this.draw();
    }
}

class Obstacle {
    constructor() {
        const rnd = Math.random();
        this.type = rnd > 0.7 ? 'high' : (rnd > 0.4 ? 'car' : 'barrier');
        this.width = this.type === 'car' ? 90 : 80;
        this.height = this.type === 'car' ? 140 : 80;
        this.lane = Math.floor(Math.random() * 3);
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.y = -this.height;
        // Cars move faster than stationary barriers to simulate traffic flow
        this.speedMultiplier = this.type === 'car' ? 1.4 : 1.0;
    }

    draw() {
        let img = obstacleImg;
        if (this.type === 'car') img = carImg;
        if (this.type === 'high') img = highImg;
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += gameSpeed * this.speedMultiplier;
        this.draw();
    }
}

class Coin {
    constructor() {
        this.width = 50;
        this.height = 50;
        this.lane = Math.floor(Math.random() * 3);
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.y = -this.height;
        this.bob = 0;
    }

    draw() {
        this.bob += 0.1;
        const bobOffset = Math.sin(this.bob) * 10;
        ctx.drawImage(coinImg, this.x, this.y + bobOffset, this.width, this.height);
    }

    update() {
        if (player.magnetTimer > 0) {
            const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
            const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 500) { // Attraction range
                this.x += (dx / distance) * 25; // Pull speed
                this.y += (dy / distance) * 25;
            }
        }
        this.y += gameSpeed;
        this.draw();
    }
}

class PowerUp {
    constructor() {
        this.type = Math.random() > 0.5 ? 'magnet' : 'jetpack';
        this.width = 60;
        this.height = 60;
        this.lane = Math.floor(Math.random() * 3);
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.y = -this.height;
    }

    draw() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.type === 'magnet' ? '#00ffcc' : '#ffaa00';
        const img = this.type === 'magnet' ? magnetImg : jetpackImg;
        ctx.drawImage(img, this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.y += gameSpeed;
        this.draw();
    }
}

class MysteryBox {
    constructor() {
        this.width = 70;
        this.height = 70;
        this.lane = Math.floor(Math.random() * 3);
        this.x = this.lane * laneWidth + laneWidth / 2 - this.width / 2;
        this.y = -this.height;
    }

    draw() {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0077';
        ctx.drawImage(mysteryBoxImg, this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.y += gameSpeed;
        this.draw();
    }
}

const player = new Player();
let obstacles = [];
let coins = [];
let powerUps = [];
let mysteryBoxes = [];
let frameCount = 0;

function spawnObstacle() {
    // Spawn rate increases as game gets faster
    const rate = Math.max(20, 60 - Math.floor(score / 5));
    if (frameCount % rate === 0) {
        obstacles.push(new Obstacle());
    }
}

function handleCollisions(obs) {
    if (player.jetpackTimer > 0 || isGameOver) return;
    
    // Collision avoidance logic
    if (player.isJumping && obs.type !== 'high') return; // Jump over ground obstacles
    if (player.isSliding && obs.type === 'high') return;  // Slide under high obstacles

    if (
        player.x + 20 < obs.x + obs.width &&
        player.x + player.width - 20 > obs.x &&
        player.y + 20 < obs.y + obs.height &&
        player.y + player.height > obs.y
    ) {
        isGameOver = true;
        gameOverScreen.style.display = 'block';
    }
}

function handleCoinCollection(c, index) {
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const cx = c.x + c.width / 2;
    const cy = c.y + c.height / 2;
    
    const dist = Math.hypot(px - cx, py - cy);
    if (dist < 60) {
        coins.splice(index, 1);
        collectedCoins++;
        coinsElement.innerText = `Coins: ${collectedCoins}`;
    }
}

function handlePowerUpCollection(p, index) {
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const ox = p.x + p.width / 2;
    const oy = p.y + p.height / 2;
    
    const dist = Math.hypot(px - ox, py - oy);
    if (dist < 70) {
        powerUps.splice(index, 1);
        if (p.type === 'magnet') {
            player.magnetTimer = 400;
        } else {
            player.jetpackTimer = 300;
        }
        score += 50;
    }
}

function handleMysteryBoxCollection(m, index) {
    const dist = Math.hypot(
        (player.x + player.width / 2) - (m.x + m.width / 2),
        (player.y + player.height / 2) - (m.y + m.height / 2)
    );

    if (dist < 70) {
        mysteryBoxes.splice(index, 1);
        const rewards = ['COINS', 'SCORE', 'MULTIPLIER'];
        const reward = rewards[Math.floor(Math.random() * rewards.length)];

        if (reward === 'COINS') {
            collectedCoins += 50;
            coinsElement.innerText = `Coins: ${collectedCoins}`;
        } else if (reward === 'SCORE') {
            score += 1000;
        } else if (reward === 'MULTIPLIER') {
            player.scoreMultiplier = 2;
            player.multiplierTimer = 600;
        }
        scoreElement.style.color = '#ff0077';
        setTimeout(() => scoreElement.style.color = '#00ffcc', 1000);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (canvas.width <= 0) return;

    // CLEAR & FALLBACK (Ensures game isn't black while loading)
    ctx.fillStyle = '#2c3e50'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // DRAW BACKGROUND (Always show, even in menu)
    bgY += (isGameOver || isPaused || !gameStarted) ? 0 : gameSpeed * 0.5;
    if (bgY >= canvas.height) bgY = 0;

    if (bgImg.complete) {
        ctx.drawImage(bgImg, 0, bgY, canvas.width, canvas.height);
        ctx.drawImage(bgImg, 0, bgY - canvas.height, canvas.width, canvas.height);
    }

    // Darken environment for better UI visibility
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Lane Markers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(laneWidth, 0); ctx.lineTo(laneWidth, canvas.height);
    ctx.moveTo(laneWidth * 2, 0); ctx.lineTo(laneWidth * 2, canvas.height);
    ctx.stroke();

    if (isGameOver || isPaused || !gameStarted) return;

    // Cinematic Vignette Effect
    const vig = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.height);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.fillStyle = vig;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    player.update();
    spawnObstacle();
    spawnCoin();
    spawnPowerUp();

    obstacles.forEach((obs, index) => {
        obs.update();
        handleCollisions(obs);

        if (obs.y > canvas.height) {
            obstacles.splice(index, 1);
            score++;
            gameSpeed += 0.05; // Gradually increase difficulty as you play
            scoreElement.innerText = `Score: ${score}`;
        }
    });

    coins.forEach((c, index) => {
        c.update();
        handleCoinCollection(c, index);
        if (c.y > canvas.height) coins.splice(index, 1);
    });

    powerUps.forEach((p, index) => {
        p.update();
        handlePowerUpCollection(p, index);
        if (p.y > canvas.height) powerUps.splice(index, 1);
    });

    mysteryBoxes.forEach((m, index) => {
        m.update();
        handleMysteryBoxCollection(m, index);
        if (m.y > canvas.height) mysteryBoxes.splice(index, 1);
    });

    frameCount++;
}

// Input handling
window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
    
    if (isPaused || !gameStarted) return;
    
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') if (player.lane > 0) player.lane--;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') if (player.lane < 2) player.lane++;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') player.jump();
    if (e.code === 'ArrowDown' || e.code === 'KeyS') player.slide();
});

// Touch / Swipe Handling
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

window.addEventListener('touchend', (e) => {
    if (isPaused || !gameStarted) return;

    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;

    // Horizontal swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50 && player.lane < 2) player.lane++;
        else if (diffX < -50 && player.lane > 0) player.lane--;
    } 
    // Vertical swipe
    else {
        if (diffY < -50) player.jump(); // Swipe Up
        else if (diffY > 50) player.slide(); // Swipe Down
    }
});

animate(); // Start the loop manager