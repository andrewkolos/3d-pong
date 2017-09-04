function render() {
    stats.begin();

    moveBallAndPaddles();

    updateConfig();

    stats.end();
    requestAnimationFrame(render);

    renderer.render(scene, camera);
}

var lightsFlag = config.lightHelpers;

function updateConfig() {

    playerPaddle.material.color.set(cssStringToColor(config.playerColor));
    if (playerScoreMesh) // may not be defined if still loading font
        playerScoreMesh.material.color.set(cssStringToColor(config.playerColor));
    computerPaddle.material.color.set(cssStringToColor(config.computerColor));
    if (computerScoreMesh)
        computerScoreMesh.material.color.set(cssStringToColor(config.computerColor));
    sound_targets_start.volume = config.musicVolume;
    sound_targets_loop.volume = config.musicVolume;
    sounds_cheers.forEach(function (audio) {
        audio.volume = config.soundVolume
    });
    sounds_hits.forEach(function (audio) {
        audio.volume = config.soundVolume
    });
    paddlePlayerMoveSpeed = PADDLE_PLAYER_BASELINE_MOVESPEED * config.playerSpeed;
    paddleComputerMoveSpeed = PADDLE_COMPUTER_BASELINE_MOVESPEED * config.computerSpeed;

    if (gamepad.getGamepad())
        $('#gamepad-image').attr('src', 'img/connected_controller.png');
    else {
        $('#gamepad-image').attr('src', 'img/disconnected.png');
        $('#gamepad-image').css('cursor', 'pointer');
    }

    dirLight1.intensity = config.directionalLight;
    hemiLight.intensity = config.hemisphereLight;
    ambientLight.intensity = config.ambientLight;
    scoreboardLight.intensity = config.scoreLight;

    if (config.lightHelpers !== lightsFlag) { // prevents repeated adding/removal of lights
        if (config.lightHelpers) {
            scene.add(dirHelper);
            scene.add(dirShadow);
            scene.add(hemiHelper);
            scene.add(scoreboardHelper);
            scene.add(scoreboardShadow);
        } else {
            scene.remove(dirHelper);
            scene.remove(dirShadow);
            scene.remove(hemiHelper);
            scene.remove(scoreboardHelper);
            scene.remove(scoreboardShadow);
        }
    }
    lightsFlag = config.lightHelpers;
}

function initBall() {
    dx = INIT_DX;
    dy = INIT_DY;
    pause = 0;
    server = 2;
    stillCollidingWithPlayer = false;
    stillCollidingWithWall = false;
}

initBall();

function moveBallAndPaddles() {
    var cameraShaking = false;

    function moveBall() {
        var vec = new THREE.Vector3(dx, dy, 0);
        var dist = vec.length();
        if (dist > BALL_SPEED_LIMIT) { // cap speed
            vec.normalize().multiplyScalar(BALL_SPEED_LIMIT);
            dx = vec.x;
            dy = vec.y;
            dist = BALL_SPEED_LIMIT;
        }
        var angle = dist / BALL_RADIUS;
        ball.position.add(vec);
        vec2 = new THREE.Vector3(-dy, dx, 0).normalize(); // axis of rotaiton
        var rotation = new THREE.Matrix4();
        rotation.makeRotationAxis(vec2, angle);
        ballInner.applyMatrix(rotation);

        var shakeFactor = (dist - SHAKE_SPEED_MIN) / (SHAKE_SPEED_MAX - SHAKE_SPEED_MIN);

        if (shakeFactor > 0) {
            cameraShaking = true;

            var bgColor = Math.floor(0x77 * Math.sqrt(Math.min(shakeFactor, 1))) * 0x10000; // math.sqrt provides a color curve
            renderer.setClearColor(bgColor, 1);

            var shakeX = (Math.random() * 2 - 1) * SHAKE_MAX_X * shakeFactor; // [-SHAKE_MAX, SHAKE_MAX)
            var shakeY = (Math.random() * 2 - 1) * SHAKE_MAX_Y * shakeFactor;
            var shakeZ = (Math.random() * 2 - 1) * SHAKE_MAX_Z * shakeFactor;
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
            playerPaddleSpeed.x = paddlePlayerMoveSpeed * x;
            playerPaddleSpeed.y = -paddlePlayerMoveSpeed * y;
        }
    }
    // move player paddle
    if (Key.isDown(Key.A)) {
        playerPaddleSpeed.x -= paddlePlayerMoveSpeed;
    }
    if (Key.isDown(Key.D)) {
        playerPaddleSpeed.x += paddlePlayerMoveSpeed;
    }
    if (Key.isDown(Key.W)) {
        playerPaddleSpeed.y += paddlePlayerMoveSpeed;
    }
    if (Key.isDown(Key.S)) {
        playerPaddleSpeed.y -= paddlePlayerMoveSpeed;
    }
    var newPlayerX = playerPaddle.position.x + playerPaddleSpeed.x;
    var newPlayerY = playerPaddle.position.y + playerPaddleSpeed.y;
    if (newPlayerX > -(PLAYFIELD_WIDTH / 2) + PADDLE_WIDTH / 2 && newPlayerX < PLAYFIELD_WIDTH / 2 - PADDLE_WIDTH / 2) {
        playerPaddle.position.x = newPlayerX;
    }
    if (newPlayerY > -PLAYFIELD_HEIGHT / 2 + PADDLE_HEIGHT / 2 && newPlayerY < -PADDLE_HEIGHT / 2 - CENTERLINE_WIDTH / 2) {
        playerPaddle.position.y = newPlayerY;
    }

    if (Key.oneDown([Key.Q, Key.RIGHTARROW, Key.UPARROW, Key.LEFTARROW, Key.E])) {

        if (Key.oneDown([Key.Q, Key.LEFTARROW, Key.RIGHTARROW, Key.E])) {
            if (Key.isDown(Key.Q) || Key.isDown(Key.LEFTARROW)) {
                playerPaddle.rotateZ(Math.PI / 48);
            }
            if (Key.isDown(Key.E) || Key.isDown(Key.RIGHTARROW)) {
                playerPaddle.rotateZ(-Math.PI / 48);
            }
        } else {
            if (Key.isDown(Key.UPARROW)) {
                if (!((Math.abs((playerPaddle.rotation.z - Math.PI) % Math.PI) < 0.02) ||
                        (Math.abs((playerPaddle.rotation.z + Math.PI) % Math.PI) < 0.02))) {
                    if ((playerPaddle.rotation.z > 0 && playerPaddle.rotation.z < Math.PI / 2) ||
                        (playerPaddle.rotation.z < (-Math.PI / 2) && playerPaddle.rotation.z > (-Math.PI))) {
                        playerPaddle.rotateZ(-Math.PI / 48);
                    }
                    else if ((playerPaddle.rotation.z > (Math.PI / 2) && playerPaddle.rotation.z < Math.PI) ||
                        (playerPaddle.rotation.z < 0 && playerPaddle.rotation.z > (-Math.PI / 2)))
                        playerPaddle.rotateZ(+Math.PI / 48);
                }
            }
        }
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
            computerPaddle.position.x += paddleComputerMoveSpeed;
            if (ball.position.x < computerPaddle.position.x)
                computerPaddle.position.x = ball.position.x;
        }
    } else {
        if (computerPaddle.position.x > -(PLAYFIELD_WIDTH / 2) + PADDLE_WIDTH / 2) {
            computerPaddle.position.x -= paddleComputerMoveSpeed;
            if (ball.position.x > computerPaddle.position.x)
                computerPaddle.position.x = ball.position.x;
        }
    }

// wall bounce
    if (ball.position.x < -(PLAYFIELD_WIDTH / 2) + BALL_RADIUS ||
        ball.position.x > (PLAYFIELD_WIDTH / 2) - BALL_RADIUS) {
        if (!stillCollidingWithWall || Math.sign(dx) === Math.sign(ball.position.x)) {
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