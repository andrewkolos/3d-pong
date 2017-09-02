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

    cameraParent = new THREE.Group();
    cameraParent.add(camera);

    scene.add(cameraParent);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableKeys = false;
    //controls.addEventListener('change', render);

    createGUI();

    loadStats();

    createPlayField();

    createWalls();

    createPaddles();

    createScoreBoard();

    createBall();

    createLights();

    loadSounds();

    gamepad = new PxGamepad();
    gamepad.start();
    if (gamepad.getGamepad())
        $('#gamepad-image').attr('src', 'img/connected_controller.png');
    else {
        $('#gamepad-image').attr('src', 'img/disconnected.png');
        $('#gamepad-image').css('cursor', 'pointer');
        $('#gamepad-image').click(function () {
            alert("No gamepad detected. If you have one plugged in, try pressing a button. Otherwise, try restarting your browser.\n\n"+
                "You can test your gamepad at http://html5gamepad.com/");
        });
    }

    window.addEventListener('resize', onResize, false);
    document.body.appendChild(renderer.domElement);

    render();
}

function createGUI() {

    gui = new dat.gui.GUI();

    colorFolder = gui.addFolder('Colors');
    colorFolder.addColor(config, 'playerColor');
    colorFolder.addColor(config, 'computerColor');
    colorFolder.open();

    difficultyFolder = gui.addFolder('Difficulty');
    difficultyFolder.add(config, 'playerSpeed', 0.5, 1.25, 0.05).setValue(1);
    difficultyFolder.add(config, 'computerSpeed', 0.5, 1.25, 0.05).setValue(1);
    difficultyFolder.open();

    var volumeFolder = gui.addFolder('Volume');
    volumeFolder.add(config, 'musicVolume', 0, 1, 0.01).setValue(0.75);
    volumeFolder.add(config, 'soundVolume', 0, 1, 0.01).setValue(1);
    volumeFolder.open();
    gui.add(config, 'resetGame');
    gui.add(config, 'resetCamera');
    gui.add(config, 'CONTROLS');
}

function loadStats() {
    stats = new Stats();
    stats.dom.style.width = 80;
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
        var playerTextGeometry = new THREE.TextGeometry("P1", {
            font: font,
            size: 1,
            height: 0.25,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelSegments: 8
        });

        var playerScoreMaterial = new THREE.MeshPhongMaterial({color: PADDLE_PLAYER_COLOR});
        playerScoreMesh = new THREE.Mesh(playerTextGeometry, playerScoreMaterial);
        playerScoreMesh.rotation.x = 90 * Math.PI / 180;
        playerScoreMesh.receiveShadow = true;
        playerScoreMesh.castShadow = true;

        playerScoreMesh.position.set(SCOREBOARD_POS_X - BALL_SPEED_METER_WIDTH / 2,
            SCOREBOARD_POS_Y - 0.25,
            SCOREBOARD_POS_Z + 0.80);
        scene.add(playerScoreMesh);

        var computerTextGeometry = new THREE.TextGeometry("P2", {
            font: font,
            size: 1,
            height: 0.25,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: .05,
            bevelSize: .05,
            bevelSegments: 8
        });

        var computerScoreMaterial = new THREE.MeshPhongMaterial({color: PADDLE_COMPUTER_COLOR});
        computerScoreMesh = new THREE.Mesh(computerTextGeometry, computerScoreMaterial);
        computerScoreMesh.rotation.x = 90 * Math.PI / 180;
        computerScoreMesh.receiveShadow = true;
        computerScoreMesh.castShadow = true;

        var computerScoreBounds = new THREE.Box3();
        computerScoreBounds.setFromObject(computerScoreMesh);

        computerScoreMesh.position.set(SCOREBOARD_POS_X + SCOREBOARD_PADDING / 2,
            SCOREBOARD_POS_Y - 0.25,
            SCOREBOARD_POS_Z + 0.80);
        scene.add(computerScoreMesh);

        function createPlane(x, y, z, width, height, color) {
            var geometry = new THREE.PlaneGeometry(width, height, 12, 12);
            var material = new THREE.MeshBasicMaterial({color: color});
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.rotation.x = Math.PI / 2;
            return mesh;
        }

        var ballSpeedMeter = createPlane(BALL_SPEED_METER_POS_X, BALL_SPEED_METER_POS_Y + 0.01, BALL_SPEED_METER_POS_Z, BALL_SPEED_METER_WIDTH, BALL_SPEED_METER_HEIGHT, BALL_SPEED_METER_COLOR);
        scene.add(ballSpeedMeter);
        var partCount = BALL_SPEED_METER_PART_COLORS.length;
        var sepSize = BALL_SPEED_METER_SEPARATOR_SIZE;

        function createProgressParts(partColors, sepSize, width, height, minValue, maxValue, allowNoMin) {
            var meterPartWidth = (width - sepSize) / partColors.length - sepSize;

            var currentX = -width / 2 + sepSize + meterPartWidth / 2;
            var meterObject = new THREE.Object3D();
            var meterParts = [];
            for (var i = 0; i < partColors.length; i++) {
                var part = createPlane(currentX, 0, 0, meterPartWidth, height - sepSize * 2, partColors[i]);
                meterParts.push(part);
                meterObject.add(part);
                part.visible = false;

                currentX += meterPartWidth + sepSize;
            }

            return {
                object: meterObject,
                update: function (value, disable) {
                    if (disable) {
                        for (var i = 0; i < meterParts.length; i++) {
                            meterParts[i].visible = false;
                        }
                    } else {
                        var partRange = (maxValue - minValue) / meterParts.length;
                        var currentMin = minValue;
                        for (var i = 0; i < meterParts.length; i++) {
                            if (allowNoMin || i > 0)
                                meterParts[i].visible = value > currentMin;
                            else
                                meterParts[i].visible = true;
                            currentMin += partRange;
                        }
                    }
                }
            };
        }

        var speedMeter = createProgressParts(
            BALL_SPEED_METER_PART_COLORS,
            BALL_SPEED_METER_SEPARATOR_SIZE,
            BALL_SPEED_METER_WIDTH,
            BALL_SPEED_METER_HEIGHT,
            BALL_SPEED_METER_MIN_SPEED,
            BALL_SPEED_METER_MAX_SPEED,
            false);
        speedMeter.object.position.set(BALL_SPEED_METER_POS_X, BALL_SPEED_METER_POS_Y, BALL_SPEED_METER_POS_Z);
        scene.add(speedMeter.object);
        updateBallSpeed = speedMeter.update;

        var progressMeter = createProgressParts(
            BALL_PROGRESS_METER_PART_COLORS,
            BALL_SPEED_METER_SEPARATOR_SIZE,
            BALL_SPEED_METER_WIDTH,
            BALL_SPEED_METER_HEIGHT,
            0, 100, true);
        progressMeter.object.position.set(BALL_SPEED_METER_POS_X, BALL_SPEED_METER_POS_Y, BALL_SPEED_METER_POS_Z);
        scene.add(progressMeter.object);
        updateBallProgress = progressMeter.update;

        var segmentHeight = 0.75;
        var segmentWidth = 1.5;
        var segmentPad = 0.10;

        // 7 segment displays
        function createSegment(segmentMaterial) {
            var segmentGeometry = new THREE.Geometry();
            var segWidthPad = segmentWidth - segmentPad;
            var segHeightPad = segmentHeight - segmentPad;
            segmentGeometry.vertices.push( // vertices in clockwise order
                new THREE.Vector3(-segWidthPad / 2, segHeightPad / 2, 0), // top left
                new THREE.Vector3(segWidthPad / 2, segHeightPad / 2, 0), // top right
                new THREE.Vector3(segWidthPad / 2 + segHeightPad / 2, 0, 0), // triangle point right
                new THREE.Vector3(segWidthPad / 2, -segHeightPad / 2, 0), // bottom right
                new THREE.Vector3(-segWidthPad / 2, -segHeightPad / 2, 0), // bottom left
                new THREE.Vector3(-segWidthPad / 2 - segHeightPad / 2, 0, 0) // triangle point left
            );
            segmentGeometry.faces.push(
                new THREE.Face3(0, 1, 3),
                new THREE.Face3(3, 4, 0),
                new THREE.Face3(1, 2, 3),
                new THREE.Face3(4, 5, 0)
            );
            segmentGeometry.computeFaceNormals();
            segmentGeometry.computeVertexNormals();

            segmentMaterial.side = THREE.DoubleSide;
            var segmentMesh = new THREE.Mesh(segmentGeometry, segmentMaterial);
            segmentMesh.receiveShadow = true;
            //segmentMesh.castShadow = true;

            return segmentMesh;
        }

        function createDigit(segmentMaterial) {
            var obj = new THREE.Object3D();
            var segs = [];
            for (var i = 0; i < 7; i++) {
                segs.push(createSegment(segmentMaterial));
                obj.add(segs[i]);
            }
            const halfSeg = segmentHeight / 2 + segmentWidth / 2;
            segs[1].position.set(-halfSeg, halfSeg, 0);
            segs[1].rotation.z = Math.PI / 2;
            segs[2].position.set(0, halfSeg * 2, 0);
            segs[3].position.set(halfSeg, halfSeg, 0);
            segs[3].rotation.z = Math.PI / 2;
            segs[4].position.set(halfSeg, -halfSeg, 0);
            segs[4].rotation.z = Math.PI / 2;
            segs[5].position.set(0, -halfSeg * 2, 0);
            segs[6].position.set(-halfSeg, -halfSeg, 0);
            segs[6].rotation.z = Math.PI / 2;

            var numStates = [
                [false, true, true, true, true, true, true],
                [false, false, false, true, true, false, false],
                [true, false, true, true, false, true, true],
                [true, false, true, true, true, true, false],
                [true, true, false, true, true, false, false],
                [true, true, true, false, true, true, false],
                [true, true, true, false, true, true, true],
                [false, false, true, true, true, false, false],
                [true, true, true, true, true, true, true],
                [true, true, true, true, true, true, false]
            ];

            return {
                object: obj,
                setNumber: function (n) {
                    for (var i = 0; i < 7; i++) {
                        segs[i].visible = numStates[n][i];
                    }
                },
                invert: function () {
                    for (var i = 0; i < 7; i++) {
                        segs[i].visible = !segs[i].visible;
                    }
                },
                clear: function () {
                    for (var i = 0; i < 7; i++) {
                        segs[i].visible = false;
                    }
                }
            };
        }

        function createFullDigit() {
            var front = createDigit(new THREE.MeshBasicMaterial({color: 0xff0000}));
            var back = createDigit(new THREE.MeshLambertMaterial({color: 0x222222}));
            var obj = new THREE.Object3D();
            obj.add(front.object);
            obj.add(back.object);

            return {
                object: obj,
                setNumber: function (n) {
                    front.setNumber(n);
                    back.setNumber(n);
                    back.invert();
                },
                invert: function () {
                    front.invert();
                    back.invert();
                },
                clear: function () {
                    front.clear();
                    back.clear();
                    back.invert();
                }
            };
        }

        function createDisplay(numDigits) {
            var obj = new THREE.Object3D();
            var digitHeight = segmentHeight * 3 + segmentWidth * 2;
            var digitWidth = segmentWidth + segmentHeight * 2;
            var fullHeight = digitHeight + segmentHeight * 2;
            var fullWidth = segmentHeight + numDigits * (digitWidth + segmentHeight);
            var currentX = -fullWidth / 2 + segmentHeight + digitWidth / 2;
            var digits = [];
            for (var i = 0; i < numDigits; i++) {
                digits.push(createFullDigit());
                obj.add(digits[i].object);
                digits[i].object.position.set(currentX, 0, 0);
                currentX += digitWidth + segmentHeight;
            }

            var backGeometry = new THREE.PlaneGeometry(fullWidth, fullHeight, 1, 1);
            var backMaterial = new THREE.MeshLambertMaterial({color: BALL_SPEED_METER_COLOR});
            var backMesh = new THREE.Mesh(backGeometry, backMaterial);
            backMesh.position.z = -0.01;
            obj.add(backMesh);

            var bounds = new THREE.Box3();
            bounds.setFromObject(obj);
            var displayHeight = bounds.max.y - bounds.min.y;
            obj.scale.x = 1 / displayHeight;
            obj.scale.y = 1 / displayHeight;

            return {
                object: obj,
                setNumber: function (n) {
                    var i = numDigits - 1;
                    do {
                        digits[i--].setNumber(n % 10);
                        n = (n - (n % 10)) / 10;
                    } while (n > 0 && i >= 0);
                    while (i >= 0) {
                        digits[i--].clear();
                    }
                },
                invert: function () {
                    for (var i = 0; i < numDigits; i++) {
                        digits[i].invert();
                    }
                },
                clear: function () {
                    for (var i = 0; i < numDigits; i++) {
                        digits[i].clear();
                    }
                }
            };
        }

        {
            playerScoreDisplay = createDisplay(2);
            var obj = playerScoreDisplay.object;
            obj.scale.x *= BALL_SPEED_METER_HEIGHT;
            obj.scale.y *= BALL_SPEED_METER_HEIGHT;

            var scoreBounds = new THREE.Box3();
            scoreBounds.setFromObject(obj);

            obj.position.set(SCOREBOARD_POS_X - (scoreBounds.max.x - scoreBounds.min.x) / 2 - SCOREBOARD_PADDING / 2, SCOREBOARD_POS_Y - 1, SCOREBOARD_POS_Z + 1.3);
            obj.rotation.x = Math.PI / 2;
            scene.add(obj);

            playerScoreDisplay.setNumber(0);
        }

        {
            computerScoreDisplay = createDisplay(2);
            var obj = computerScoreDisplay.object;
            obj.scale.x *= BALL_SPEED_METER_HEIGHT;
            obj.scale.y *= BALL_SPEED_METER_HEIGHT;

            var scoreBounds = new THREE.Box3();
            scoreBounds.setFromObject(obj);

            obj.position.set(SCOREBOARD_POS_X + BALL_SPEED_METER_WIDTH / 2 - (scoreBounds.max.x - scoreBounds.min.x) / 2, SCOREBOARD_POS_Y - 1, SCOREBOARD_POS_Z + 1.3);
            obj.rotation.x = Math.PI / 2;
            scene.add(obj);

            computerScoreDisplay.setNumber(0);
        }
    });
}

function createBall() {
    var geomtry = new THREE.SphereGeometry(BALL_RADIUS, BALL_NUM_SEGMENTS, BALL_NUM_SEGMENTS);
    var material = new THREE.MeshPhongMaterial();
    material.map = THREE.ImageUtils.loadTexture('img/soccer1.jpg');
    ballInner = new THREE.Mesh(geomtry, material);
    ballInner.receiveShadow = true;
    ballInner.castShadow = true;

    ball = new THREE.Group();
    ball.position.set(0, 0, BALL_RADIUS);
    ball.add(ballInner);

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
    dirLight1.shadow.camera.top = 12;
    dirLight1.shadow.camera.bottom = -12;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
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
    var one_u_15 = new Audio("sounds/1_pitchup_15.mp3");
    var one_d_5 = new Audio("sounds/1_pitchdown_5.mp3");
    var one_d_10 = new Audio("sounds/1_pitchdown_10.mp3");
    var one_d_15 = new Audio("sounds/1_pitchdown_15.mp3");
    sounds_hits = [one, one_u_5, one_u_10, one_d_5, one_d_10, one_u_15, one_d_15];

    var cheer = new Audio("sounds/cheer.mp3");
    var cheer2 = new Audio("sounds/cheer2.mp3");
    var ohno = new Audio("sounds/ohno.mp3");
    sounds_cheers = [cheer, cheer2];

    sound_targets_start = new Audio("sounds/targets_start.mp3");
    sound_targets_loop = new Audio("sounds/targets_loop.mp3");
    sound_targets_loop.loop = true;
    sound_targets_start.onended = function () {
        sound_targets_loop.currentTime = 0;
        sound_targets_loop.play();
    };
    sound_targets_start.play();

}