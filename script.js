const canvas = document.getElementById("game-canvas");

const ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality='high'
const gameContainer = document.getElementById('game-container');

const flappyPlayer = new Image()
flappyPlayer.src = 'assets/bird.png';
console.log('flappyPlayer',flappyPlayer);
flappyPlayer.style.width = 40;
flappyPlayer.style.height = 50

/// general settings
const FLAP_SPEED = -3;
const BIRD_WIDTH = 10;
const BIRD_HEIGHT = 10;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;
/// bird settings
let birdX = 10;
let birdY = 0;
let birdVelocity = 10;
let birdAcceleration = 0.1;

/// pipes settings
let pipeX = 400;
let pipeY = canvas.height - 100;

/// score display
let scoreDiv = document.getElementById('score-display');
let score = 0;
var highScore = window.localStorage.getItem('bestscoreflappy') || 0 ;

var difficult = 2;

let scored = false;


///binding keyboard
document.body.onkeydown = function(e) {
    if(e.code == 'Space' || e.code == 'ArrowUp') {
        birdVelocity = FLAP_SPEED;
    };
};

gameContainer.onclick = function(e) {
        birdVelocity = FLAP_SPEED;
};

const restartGame = document.getElementById('restart-btn');
restartGame.addEventListener('click', ()=>{
    location.reload();
    hideEndMenu()
})

function increaseScore() {
    if(birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
          birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
          !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
        if(score > highScore) {
            highScore = score;
        }
        window.localStorage.setItem('bestscoreflappy',highScore);
    }

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }

};

function showEndMenu() {
    document.getElementById('end-game').style.display='block';
    document.getElementById('end-game').style.zIndex= 10;
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML= score;
    document.getElementById('best-score').innerHTML= highScore;
};

function hideEndMenu() {
    document.getElementById('end-game').style.display='none';
    gameContainer.classList.remove('backdrop-blur');
};

function collisionCheck() {
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    };

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }
    // console.log('birdBox', birdBox);
    // console.log('topPipeBox', topPipeBox);

    //// check coliision upper pipe
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
            return true;
    }

    //// check coliision lower pipe
    if (birdBox.x + birdBox.width + 50 > bottomPipeBox.x &&
        birdBox.x < 50 + bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height + 50 > bottomPipeBox.y) {
            return true;
    }
    return false
}


function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Flappy Bird
    ctx.drawImage(flappyPlayer, birdX, birdY);

    // Draw Pipes
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -120, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);


    birdVelocity+= birdAcceleration;
    birdY+= birdVelocity;
    
    if(birdY > 600 ||collisionCheck() ) {
        showEndMenu()
        highScore = score;
        return
    }
    pipeX -= difficult
    if(pipeX < -50) {
        pipeX = 400
        pipeY = Math.random() * (canvas.height - PIPE_GAP) +  PIPE_WIDTH;
    }
    

    increaseScore();
    requestAnimationFrame(loop);
};



loop();

window.setInterval( () => {
    difficult++
    console.log('level up')
},20000)
