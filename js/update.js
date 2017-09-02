function render() {
    moveBallAndPaddles();

    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

var dx = INIT_DX;
var dy = INIT_DY;
var pause = 0;
var server = 2;
var stillCollidingWithPlayer = false;
var stillCollidingWithWall = false;

function moveBallAndPaddles() {
    var cameraShaking = false;
    function moveBall() {
        var vec = new THREE.Vector3(dx, dy, 0);
        var dist = vec.length();
        if(dist > BALL_SPEED_LIMIT) { // cap speed
            vec.normalize().multiplyScalar(BALL_SPEED_LIMIT);
            dx = vec.x;
            dy = vec.y;
            dist = BALL_SPEED_LIMIT;
        }
        var angle = dist/BALL_RADIUS;
        ball.position.add(vec);
        vec2 = new THREE.Vector3(-dy, dx, 0).normalize(); // axis of rotaiton
        var rotation = new THREE.Matrix4();
        rotation.makeRotationAxis(vec2, angle);
        ballInner.applyMatrix(rotation);

        var shakeFactor = (dist - SHAKE_SPEED_MIN)/(SHAKE_SPEED_MAX - SHAKE_SPEED_MIN);

        if(shakeFactor > 0) {
            cameraShaking = true;

            var bgColor = Math.floor(0x77*Math.sqrt(Math.min(shakeFactor, 1))) * 0x10000; // math.sqrt provides a color curve
            renderer.setClearColor(bgColor, 1);

            var shakeX = (Math.random()*2-1)*SHAKE_MAX_X*shakeFactor; // [-SHAKE_MAX, SHAKE_MAX)
            var shakeY = (Math.random()*2-1)*SHAKE_MAX_Y*shakeFactor;
            var shakeZ = (Math.random()*2-1)*SHAKE_MAX_Z*shakeFactor;
            cameraParent.position.set(shakeX, shakeY, shakeZ);
        }
    }
    var disableSpeedDisplay = false;
    if (pause > 0) {
        if (server === 0) {
            ball.position.x = playerPaddle.position.x + (PADDLE_HEIGHT / 2 + BALL_RADIUS * 2) * Math.cos(playerPaddle.rotation.z + Math.PI / 2);
            ball.position.y = playerPaddle.position.y + (PADDLE_HEIGHT / 2 + BALL_RADIUS * 2) * Math.sin(playerPaddle.rotation.z + Math.PI / 2);
        } else if (server === 1) {
            ball.position.x = computerPaddle.position.x;
            ball.position.y = computerPaddle.position.y - 2 * PADDLE_HEIGHT;
        }
        pause--;
        disableSpeedDisplay = true;
        updateBallProgress((NUM_FRAMES_PAUSE_AFTER_SCORE - pause) / NUM_FRAMES_PAUSE_AFTER_SCORE * 100, false);
    } else {
        if (pause === 0) {
            if (server === 0) {
                dx = INIT_DY * Math.cos(playerPaddle.rotation.z - Math.PI / 2);
                dy = INIT_DY * Math.sin(playerPaddle.rotation.z - Math.PI / 2);
            } else if (server === 1) {
                dx = continousRandom(MIN_DX, MAX_DX) * (Math.random() > 0.50 ? 1 : -1);
                dy = -INIT_DY;
            }
            pause--;
        }
        moveBall();
        updateBallProgress(0, true);
    }

    var playerPaddleSpeed = new THREE.Vector2(0, 0);
    var gp = gamepad.getGamepad();
    if (gp) {
        var x = gp.axes[0];
        var y = gp.axes[1];
        var r = Math.hypot(x, y);
        if (r > 0.1) {
            playerPaddleSpeed.x = PADDLE_PLAYER_MOVESPEED * x;
            playerPaddleSpeed.y = -PADDLE_PLAYER_MOVESPEED * y;
        }
    }
    // move player paddle
    if (Key.isDown(Key.A)) {
        playerPaddleSpeed.x -= PADDLE_PLAYER_MOVESPEED;
    }
    if (Key.isDown(Key.D)) {
        playerPaddleSpeed.x += PADDLE_PLAYER_MOVESPEED;
    }
    if (Key.isDown(Key.W)) {
        playerPaddleSpeed.y += PADDLE_PLAYER_MOVESPEED;
    }
    if (Key.isDown(Key.S)) {
        playerPaddleSpeed.y -= PADDLE_PLAYER_MOVESPEED;
    }
    var newPlayerX = playerPaddle.position.x + playerPaddleSpeed.x;
    var newPlayerY = playerPaddle.position.y + playerPaddleSpeed.y;
    if (newPlayerX > -(PLAYFIELD_WIDTH / 2) + PADDLE_WIDTH / 2 && newPlayerX < PLAYFIELD_WIDTH / 2 - PADDLE_WIDTH / 2) {
        playerPaddle.position.x = newPlayerX;
    }
    if (newPlayerY > -PLAYFIELD_HEIGHT / 2 + PADDLE_HEIGHT / 2 && newPlayerY < -PADDLE_HEIGHT / 2 - CENTERLINE_WIDTH / 2) {
        playerPaddle.position.y = newPlayerY;
    }
    if (Key.isDown(Key.Q)) {
        playerPaddle.rotateZ(Math.PI / 32);
    }
    if (Key.isDown(Key.E)) {
        playerPaddle.rotateZ(-Math.PI / 32);
    }
    if (gp) {
        var x = gp.axes[2];
        var y = -gp.axes[3];
        var r = Math.hypot(x, y);
        if (r > 0.5) {
            var angle = Math.atan2(y, x);
            playerPaddle.rotation.z = angle - Math.PI / 2;
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
    if (ball.position.x < -(PLAYFIELD_WIDTH / 2) + BALL_RADIUS ||
        ball.position.x > (PLAYFIELD_WIDTH / 2) - BALL_RADIUS) {
        if(!stillCollidingWithWall || Math.sign(dx) === Math.sign(ball.position.x)) {
            dx = -dx;
            moveBall();
            playRandomSound(sounds_hits);

            stillCollidingWithWall = true;
        } else {
            stillCollidingWithWall = false;
        }
    }

    var computerHitbox = new THREE.Box3().setFromObject(computerPaddle);
    if (ball.position.y > computerPaddle.position.y - computerHitbox.getSize().y &&
        Math.abs(computerPaddle.position.x - ball.position.x) <= (computerHitbox.getSize().x / 2 + 0.5)) { // hit computer paddle
        dy += dy < 0 ? -BALL_SPEED_INCREASE_ON_PADDLE_HIT : BALL_SPEED_INCREASE_ON_PADDLE_HIT;
        dy = -dy * COMPUTER_IMPACT_SPEEDUP;
        ball.position.y = computerPaddle.position.y - computerHitbox.getSize().y; // prevents ball getting stuck inside paddle
        ballIframes = BALL_IFRAMES;
        playRandomSound(sounds_hits);
    }

    var origin = new THREE.Vector2(0, 0);
    var ballRelPos = new THREE.Vector2(ball.position.x - playerPaddle.position.x, ball.position.y - playerPaddle.position.y);
    var newBallRelPos = ballRelPos.rotateAround(origin, -playerPaddle.rotation.z);

    if (Math.abs(newBallRelPos.x) - BALL_RADIUS < PADDLE_WIDTH / 2 && Math.abs(newBallRelPos.y) - BALL_RADIUS < PADDLE_HEIGHT / 2) {
        //dy += dy < 0 ? -BALL_SPEED_INCREASE_ON_PADDLE_HIT : BALL_SPEED_INCREASE_ON_PADDLE_HIT;
        //dy = -dy;
        var d = new THREE.Vector2(dx, dy);
        d.x -= playerPaddleSpeed.x * PLAYER_IMPACT_SPEEDUP;
        d.y -= playerPaddleSpeed.y * PLAYER_IMPACT_SPEEDUP;
        d.rotateAround(origin, -playerPaddle.rotation.z);
        if (!stillCollidingWithPlayer || d.y < 0) {
            d.y = -d.y;
            d.rotateAround(origin, playerPaddle.rotation.z);
            dx = d.x;
            dy = d.y;
            playRandomSound(sounds_hits);

            moveBall();

            stillCollidingWithPlayer = true;
        }
    } else {
        stillCollidingWithPlayer = false;
    }

    updateBallSpeed(Math.hypot(dx, dy), disableSpeedDisplay);

    /*var playerHitbox = new THREE.Box3().setFromObject(playerPaddle);
    var diff = playerPaddle.position.y - ball.position.y + PADDLE_HEIGHT;
    if (diff < 1 && diff > -0.2 &&
        Math.abs(playerPaddle.position.x - ball.position.x) <= (playerHitbox.getSize().x / 2 + BALL_RADIUS)) { // hit player paddle
    }*/


    var ballHeight = new THREE.Box3().setFromObject(ball).getSize().y;
    if (ball.position.y > PLAYFIELD_HEIGHT / 2 + ballHeight) { // player score

        dy = -INIT_DY;
        dx = continousRandom(MIN_DX, MAX_DX) * (Math.random() > 0.50 ? 1 : -1);

        pause = NUM_FRAMES_PAUSE_AFTER_SCORE;
        server = 1;
        playRandomSound(sounds_cheers);

        playerScore += 1;
        playerScoreDisplay.setNumber(playerScore);
    }

    if (ball.position.y < -(PLAYFIELD_HEIGHT / 2) - ballHeight) { // computer score
        dy = INIT_DY;
        dx = continousRandom(MIN_DX, MAX_DX) * (Math.random() > 0.50 ? 1 : -1);

        pause = NUM_FRAMES_PAUSE_AFTER_SCORE;
        server = 0;
        playRandomSound(sounds_cheers);

        computerScore += 1;
        computerScoreDisplay.setNumber(computerScore);
    }

    if (!cameraShaking) {
        renderer.setClearColor(0, 1);
        cameraParent.position.set(0, 0, 0);
    }
}

var last = -1;

function playRandomSound(audioArray) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var rand = getRandomInt(0, audioArray.length - 1);
    while (rand === last) {
        rand = getRandomInt(0, audioArray.length - 1);
    }
    last = rand;
    audioArray[rand].play();
}

function continousRandom(min, max) {
    return Math.random() * (max - min) + min;
}