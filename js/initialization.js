function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled= true;
    renderer.shadowMapSoft = true;


    scene.add(camera);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);

    createPlayField();

    createWalls();

    createPaddles();

    createScoreBoard();

    createBall();

    createSpotlight();

    document.body.appendChild(renderer.domElement);

    render();
}

function render() {
    renderer.render(scene, camera);
}

function createPlayField() {
    function createPlayPlane(color, length, offset) {
        var geometry = new THREE.PlaneGeometry(PLAYFIELD_WIDTH, length);
        var material = new THREE.MeshLambertMaterial({color: color});
        var plane = new THREE.Mesh(geometry, material);
        plane.material.side = THREE.DoubleSide;
        plane.receiveShadow = true;
        plane.position.set(0, offset,0);

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
    leftWall.position.set(-PLAYFIELD_WIDTH / 2 - (WALL_WIDTH/2), 0, WALL_WIDTH);
    leftWall.castShadow = true;
    scene.add(leftWall);

    var rightWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, WALL_HEIGHT);
    var rightWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(PLAYFIELD_WIDTH / 2 + (WALL_WIDTH/2), 0, WALL_WIDTH);
    rightWall.castShadow = true;
    scene.add(rightWall);
}

function createPaddles() {
    function createPaddle(color, offset) {
        var paddleGeometry = new THREE.BoxGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH);
        var paddleMaterial = new THREE.MeshLambertMaterial({ color: color });

        var paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddle.position.set(0, offset, PADDLE_DEPTH / 2);
        paddle.castShadow = true;
        paddle.receiveShadow = true;

        return paddle;
    }

    playerPaddle = createPaddle(PADDLE_PLAYER_COLOR, - (PLAYFIELD_HEIGHT / 2) + PADDLE_HEIGHT/ 2);
    computerPaddle = createPaddle(PADDLE_COMPUTER_COLOR, PLAYFIELD_HEIGHT / 2);

    scene.add(playerPaddle)
    scene.add(computerPaddle);
}

function createScoreBoard() {

}

function createBall() {
    var geomtry = new THREE.SphereGeometry(BALL_RADIUS, BALL_NUM_SEGMENTS, BALL_NUM_SEGMENTS);
    var material = new THREE.MeshLambertMaterial({ color: BALL_COLOR });
    ball = new THREE.Mesh(geomtry, material);
    ball.position.set(0,0,BALL_RADIUS);
    ball.receiveShadow = true;
    ball.castShadow = true;

    scene.add(ball);
}

function createSpotlight() {
    // We choose directional light as it can be used to simulate sunlight.
    // See three.js documentation.

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-7, 0, 8);
    light.castShadow = true; // expensive
    light.shadowCameraVisible = true;
    light.shadowDarkness = 1;
    light.shadowCameraNear = 3;
    light.shadowCameraFar = camera.far;
    //light.shadow.mapSize.width = 29;
    //light.shadow.mapSize.height = 20;
    light.shadowCameraLeft = -7;
    light.shadowCameraRight = 7;
    light.shadowCameraTop = 10;
    light.shadowCameraBottom = -10;
    scene.add(light);

    var dirHelper = new THREE.DirectionalLightHelper(light);
    scene.add(dirHelper);

    scene.add(new THREE.CameraHelper(light.shadow.camera));

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 0, 10 );
    scene.add( hemiLight );

    var ambientLight = new THREE.AmbientLight(0xffffff, .10);
    scene.add(ambientLight);

    var hemiHelper = new THREE.HemisphereLightHelper(hemiLight);
    scene.add(hemiHelper);
}