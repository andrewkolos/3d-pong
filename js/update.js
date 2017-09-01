function render() {
    moveBallAndPaddles();

    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

var dx = INIT_DX;
var dy = INIT_DY;
var pause = 0;
var server = playerPaddle;
var ballIframes = 0;
function moveBallAndPaddles() {
    ballIframes--;
    if (pause > 0) {
        ball.position.x = server.position.x;
        ball.position.y = server.position.y + ((server.position.y < 0) ? PADDLE_HEIGHT * 2 : - PADDLE_HEIGHT);
        pause--;
    } else {
        ball.position.x += dx;
        ball.position.y += dy;
    }

    // move player paddle
    if (Key.isDown(Key.A)) {
        if (playerPaddle.position.x > -(PLAYFIELD_WIDTH / 2) + PADDLE_WIDTH / 2) {
            playerPaddle.position.x -= PADDLE_PLAYER_MOVESPEED;
        }
    }
    if (Key.isDown(Key.D)) {
        if (playerPaddle.position.x < PLAYFIELD_WIDTH / 2 - PADDLE_WIDTH / 2) {
            playerPaddle.position.x += PADDLE_PLAYER_MOVESPEED;
        }
    }
    if (Key.isDown(Key.W)) {
        if (playerPaddle.position.y < - PADDLE_HEIGHT /2 - CENTERLINE_WIDTH/2) {
            playerPaddle.position.y += PADDLE_PLAYER_MOVESPEED;
        }
    }
    if (Key.isDown(Key.S)) {
        if (playerPaddle.position.y > - PLAYFIELD_HEIGHT / 2 + PADDLE_HEIGHT /2) {
            playerPaddle.position.y -= PADDLE_PLAYER_MOVESPEED;
        }
    }

    // move computer paddle
    if (ball.position.x > computerPaddle.position.x) {
        if (computerPaddle.position.x < PLAYFIELD_WIDTH / 2 - PADDLE_WIDTH / 2) {
            computerPaddle.position.x += PADDLE_COMPUTER_MOVESPEED;
            if (ball.position.x < computerPaddle.position.x)
                computerPaddle.position.x = ball.position.x;
        }
    } else {
        if (computerPaddle.position.x > -(PLAYFIELD_WIDTH / 2) + PADDLE_WIDTH / 2) {
            computerPaddle.position.x -= PADDLE_COMPUTER_MOVESPEED;
            if (ball.position.x > computerPaddle.position.x)
                computerPaddle.position.x = ball.position.x;
        }
    }

    // wall bounce
    if (ball.position.x < -(PLAYFIELD_WIDTH/2) + BALL_RADIUS ||
        ball.position.x > (PLAYFIELD_WIDTH/2) - BALL_RADIUS) {
        dx = -dx;
        playRandomSound(sound_hits);
    }

    if (ballIframes <= 0) {
        computerHitbox = new THREE.Box3().setFromObject(computerPaddle);
        if (ball.position.y > computerPaddle.position.y - computerHitbox.getSize().y &&
            Math.abs(computerPaddle.position.x - ball.position.x) <= (computerHitbox.getSize().x / 2  + 0.5)) { // hit computer paddle
            dy += dy < 0 ? -BALL_SPEED_INCREASE_ON_PADDLE_HIT : BALL_SPEED_INCREASE_ON_PADDLE_HIT;
            dy = -dy;
            ball.position.y = computerPaddle.position.y - computerHitbox.getSize().y; // prevents ball getting stuck inside paddle
            ballIframes = 15;
            playRandomSound(sound_hits);
        }

        playerHitbox = new THREE.Box3().setFromObject(playerPaddle);
        var diff = playerPaddle.position.y - ball.position.y + PADDLE_HEIGHT;
        if (diff < 1 && diff > -0.2 &&
            Math.abs(playerPaddle.position.x - ball.position.x) <= (playerHitbox.getSize().x / 2 + BALL_RADIUS)) { // hit player paddle
            dy += dy < 0 ? -BALL_SPEED_INCREASE_ON_PADDLE_HIT : BALL_SPEED_INCREASE_ON_PADDLE_HIT;
            dy = -dy;
            ball.position.y = playerPaddle.position.y + playerHitbox.getSize().y;
            ballIframes = 15;
            playRandomSound(sound_hits);
        }
    }

    var ballHeight = new THREE.Box3().setFromObject(ball).getSize().y;
    if (ball.position.y > PLAYFIELD_HEIGHT / 2 + ballHeight) { // player score

        dy = -INIT_DY;
        dx = continousRandom(MIN_DX, MAX_DX) * (Math.random() > 0.50 ? 1 : -1);

            pause = NUM_FRAMES_PAUSE_AFTER_SCORE;
            server = computerPaddle;

        playRandomSound(sounds_cheers);
    }

    if (ball.position.y < -(PLAYFIELD_HEIGHT / 2) - ballHeight) { // computer score
        dy = INIT_DY;
        dx = continousRandom(MIN_DX, MAX_DX) * (Math.random() > 0.50 ? 1 : -1);

        pause = NUM_FRAMES_PAUSE_AFTER_SCORE;
        server = playerPaddle;
        playRandomSound(sounds_cheers);
    }
}

var last = -1;
function playRandomSound(audioArray) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var rand = getRandomInt(0, audioArray.length-1);
    while (rand === last) {
        rand = getRandomInt(0, audioArray.length-1);
    }
    last = rand;
    audioArray[rand].play();
}

function continousRandom(min, max) {
    return Math.random() * (max - min) + min;
}