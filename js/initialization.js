function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    ///renderer.shadowMap.type = THREE.BasicShadowMap;//THREE.PCFSoftShadowMap;
    //renderer.shadowMap.renderReverseSided = false;


    scene.add(camera);

    new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener('change', render);

    createPlayField();

    createWalls();

    createPaddles();

    createScoreBoard();

    createBall();

    createLights();

    loadSounds();

    gamepad = new PxGamepad();
    gamepad.start();

    document.body.appendChild(renderer.domElement);

    render();
}



function createPlayField() {
    function createPlayPlane(color, length, offset) {
        var geometry = new THREE.PlaneGeometry(PLAYFIELD_WIDTH, length, 32, 32);
        var material = new THREE.MeshLambertMaterial({color: color});
        var plane = new THREE.Mesh(geometry, material);
        plane.material.side = THREE.DoubleSide;
        plane.receiveShadow = true;
        plane.position.set(0, offset, 0);

        scene.add(plane);
    }

    var playPlaneLength = (PLAYFIELD_HEIGHT / 2) - (CENTERLINE_WIDTH / 2);
    var playPlanePos = (CENTERLINE_WIDTH / 2) + (playPlaneLength / 2);
    createPlayPlane(PLAYFIELD_COLOR, playPlaneLength, playPlanePos);
    createPlayPlane(PLAYFIELD_COLOR, playPlaneLength, -playPlanePos);
    createPlayPlane(0xFFFFFF, CENTERLINE_WIDTH, 0);
}


function createWalls() {
    var leftWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, WALL_HEIGHT);
    var leftWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-PLAYFIELD_WIDTH / 2 - (WALL_WIDTH / 2), 0, WALL_WIDTH);
    leftWall.castShadow = true;
    scene.add(leftWall);

    var rightWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, WALL_HEIGHT);
    var rightWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(PLAYFIELD_WIDTH / 2 + (WALL_WIDTH / 2), 0, WALL_WIDTH);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createPaddles() {
    function createPaddle(color, offset) {
        var paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH);
        var paddleMaterial = new THREE.MeshLambertMaterial({color: color});

        var paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle.position.set(0, offset, PADDLE_DEPTH / 2);
        paddle.castShadow = true;
        paddle.receiveShadow = true;

        return paddle;
    }

    playerPaddle = createPaddle(PADDLE_PLAYER_COLOR, -(PLAYFIELD_HEIGHT / 2) + PADDLE_HEIGHT / 2);
    computerPaddle = createPaddle(PADDLE_COMPUTER_COLOR, PLAYFIELD_HEIGHT / 2 - PADDLE_HEIGHT / 2);

    scene.add(playerPaddle);
    scene.add(computerPaddle);
}

function createScoreBoard() {
    var boardGeometry = new THREE.BoxGeometry(SCOREBOARD_WIDTH, SCOREBOARD_HEIGHT, SCOREBOARD_DEPTH, 32, 32, 32);
    var boardMaterial = new THREE.MeshPhongMaterial({color: SCOREBOARD_COLOR});
    scoreboardBase = new THREE.Mesh(boardGeometry, boardMaterial);
    scoreboardBase.position.set(SCOREBOARD_POS_X, SCOREBOARD_POS_Y, SCOREBOARD_POS_Z);
    scoreboardBase.castShadow = true;
    scoreboardBase.receiveShadow = true;

    scene.add(scoreboardBase);

    var loader = new THREE.FontLoader();

    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        var playerTextGeometry = new THREE.TextGeometry("Player Score", {
            font: font,
            size: 1,
            height: 0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelSegments: 5
        });

        var playerScoreMaterial = new THREE.MeshPhongMaterial({color: PADDLE_PLAYER_COLOR});
        var playerScoreMesh = new THREE.Mesh(playerTextGeometry, playerScoreMaterial);
        playerScoreMesh.rotation.x = 90 * Math.PI / 180;
        playerScoreMesh.receiveShadow = true;
        playerScoreMesh.castShadow = true;

        playerScoreMesh.position.set(SCOREBOARD_POS_X - SCOREBOARD_WIDTH / 2 + 1,
                            SCOREBOARD_POS_Y - 0.25,
                            SCOREBOARD_POS_Z + SCOREBOARD_DEPTH / 4);
        scene.add(playerScoreMesh);

        var computerTextGeometry = new THREE.TextGeometry("Computer Score", {
            font: font,
            size: 1,
            height: 0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelSegments: 5
        });

        var computerScoreMaterial = new THREE.MeshPhongMaterial({color: PADDLE_COMPUTER_COLOR});
        var computerScoreMesh = new THREE.Mesh(computerTextGeometry, computerScoreMaterial);
        computerScoreMesh.rotation.x = 90 * Math.PI / 180;
        computerScoreMesh.receiveShadow = true;
        computerScoreMesh.castShadow = true;

        computerScoreMesh.position.set(SCOREBOARD_POS_X + 1,
            SCOREBOARD_POS_Y - 0.25,
            SCOREBOARD_POS_Z + SCOREBOARD_DEPTH / 4);
        scene.add(computerScoreMesh);

        var ballSpeedGeometry = new THREE.TextGeometry("Ball Speed", {
            font: font,
            size: 0.8,
            height: 0,
            curveSegments: 4,
            bevelEnabled: true,
            bevelThickness: .20,
            bevelSize: .04,
            bevelSegments: 20
        });
        var ballSpeedMaterial = new THREE.MeshPhongMaterial({color: 0x673AB7});
        ballSpeedMesh = new THREE.Mesh(ballSpeedGeometry, ballSpeedMaterial);
        ballSpeedMesh.position.set(SCOREBOARD_POS_X, SCOREBOARD_POS_Y - 0.25, SCOREBOARD_POS_Z - SCOREBOARD_DEPTH /4);
        ballSpeedMesh.rotation.x = 90 * Math.PI / 180;
        ballSpeedMesh.castShadow = true;
        ballSpeedMesh.receiveShadow = true;
        scene.add(ballSpeedMesh);

        function createPlane(x, y, z, width, height, color) {
            var geometry = new THREE.PlaneGeometry(width, height, 12, 12);
            var material = new THREE.MeshBasicMaterial({color: color});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z)
            mesh.rotation.x = Math.PI / 2;
            scene.add(mesh);
            return mesh;
        }

        var partCount = BALL_SPEED_METER_PART_COLORS.length;
        var sepSize = BALL_SPEED_METER_SEPARATOR_SIZE;
        var ballSpeedMeter = createPlane(BALL_SPEED_METER_POS_X, BALL_SPEED_METER_POS_Y, BALL_SPEED_METER_POS_Z, BALL_SPEED_METER_WIDTH, BALL_SPEED_METER_HEIGHT, BALL_SPEED_METER_COLOR);
        var meterPartWidth = (BALL_SPEED_METER_WIDTH - sepSize) / partCount - sepSize;

        var currentX = BALL_SPEED_METER_POS_X - BALL_SPEED_METER_WIDTH / 2 + sepSize + meterPartWidth / 2;
        var meterParts = [];
        for (var i = 0; i < partCount; i++) {
            var part = createPlane(currentX, BALL_SPEED_METER_POS_Y - 0.01, BALL_SPEED_METER_POS_Z, meterPartWidth, BALL_SPEED_METER_HEIGHT - sepSize * 2, BALL_SPEED_METER_PART_COLORS[i]);
            meterParts.push(part);
            part.visible = false;

            currentX += meterPartWidth + sepSize;
        }

        updateBallSpeed = function(ballSpeed, disableBallSpeed) {
            if (disableBallSpeed) {
               for (var i = 0; i < meterParts.length; i++) {
                   meterParts[i].visible = false;
               }
            } else {
                var speedPart = (BALL_SPEED_METER_MAX_SPEED - BALL_SPEED_METER_MIN_SPEED) / meterParts.length;
                var currentSpeed = BALL_SPEED_METER_MIN_SPEED + speedPart;
                meterParts[0].visible = true;
                for (var i = 1; i < meterParts.length; i++) {
                    meterParts[i].visible = ballSpeed > currentSpeed;
                    currentSpeed += speedPart;
                }
            }
        };

        console.log("hi");
    });
}

function createBall() {
    var geomtry = new THREE.SphereGeometry(BALL_RADIUS, BALL_NUM_SEGMENTS, BALL_NUM_SEGMENTS);
    var material = new THREE.MeshLambertMaterial({color: BALL_COLOR});
    ball = new THREE.Mesh(geomtry, material);
    ball.position.set(0, 0, BALL_RADIUS);
    ball.receiveShadow = true;
    ball.castShadow = true;

    scene.add(ball);
}

function createLights() {
    // We choose directional light as it can be used to simulate sunlight.
    // See three.js documentation.

    var dirLight1 = new THREE.DirectionalLight(0xffffff, 1);
    dirLight1.position.set(-7, -5, 8);
    dirLight1.castShadow = true; // expensive
    dirLight1.shadow.camera.near = 4;
    dirLight1.shadow.camera.far = camera.far;
    dirLight1.shadow.camera.left = -7;
    dirLight1.shadow.camera.right = 7;
    dirLight1.shadow.camera.top = 13;
    dirLight1.shadow.camera.bottom = -13;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    scoreboardLight = new THREE.SpotLight(0xffffff, 2);
    scoreboardLight.position.set(SCOREBOARD_POS_X, SCOREBOARD_POS_Y - 10, SCOREBOARD_POS_Z - 20);
    scoreboardLight.target = scoreboardBase;
    scoreboardLight.angle = 0.6;
    scoreboardLight.distance = 28;
    scoreboardLight.castShadow = true;
    scoreboardLight.shadow.camera.near = 0.1;
    scoreboardLight.shadow.camera.far = scoreboardLight.distance;
    scoreboardLight.shadow.mapSize.width = 1024;
    scoreboardLight.shadow.mapSize.height = 1024;

    scoreboardLight.target.updateMatrixWorld();
    scene.add(scoreboardLight);


    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 0, 10);
    scene.add(hemiLight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.10);
    scene.add(ambientLight);

    if (DEBUG) {
        var dirHelper = new THREE.DirectionalLightHelper(dirLight1);
        scene.add(dirHelper);
        scene.add(new THREE.CameraHelper(dirLight1.shadow.camera));
        var hemiHelper = new THREE.HemisphereLightHelper(hemiLight);
        scene.add(hemiHelper);
        scene.add(new THREE.SpotLightHelper(scoreboardLight));
        scene.add(new THREE.CameraHelper(scoreboardLight.shadow.camera));
    }
}

function loadSounds() {
    //sound_applause1 = new Audio();
    //sound_applause2 = new Audio();
    var one = new Audio("sounds/1.mp3");
    var one_u_5 = new Audio("sounds/1_pitchup_5.mp3");
    var one_u_10 = new Audio("sounds/1_pitchup_10.mp3");
    var one_d_5 = new Audio("sounds/1_pitchdown_5.mp3");
    var one_d_10 = new Audio("sounds/1_pitchdown_10.mp3");
    var three = new Audio("sounds/3.mp3");
    var five = new Audio("sounds/5.mp3")
    sounds_hits = [one, one_u_5, one_u_10, one_d_5, one_d_10, three, five];

    var cheer = new Audio("sounds/cheer.mp3");
    var cheer2 = new Audio("sounds/cheer2.mp3");
    var ohno = new Audio("sounds/ohno.mp3");
    sounds_cheers = [cheer, cheer2];

    var sound_targets_start = new Audio("sounds/targets_start.mp3");
    sound_targets_start.volume = 0.4;
    var sound_targets_loop = new Audio("sounds/targets_loop.mp3");
    sound_targets_loop.volume = 1;
    sound_targets_loop.onend = sound_targets_loop.play;
    sound_targets_loop.loop = true;
    sound_targets_start.play();
    sound_targets_start.onended = sound_targets_loop.play;

}