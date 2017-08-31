function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;
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
    var playPlaneLength = (PLAYFIELD_HEIGHT / 2) - (CENTERLINE_WIDTH / 2);
    var playPlanePos = (CENTERLINE_WIDTH / 2) + (playPlaneLength / 2);
    var backPlane = createPlayPlane(PLAYFIELD_COLOR, playPlaneLength, playPlanePos);
    var frontPlane = createPlayPlane(PLAYFIELD_COLOR, playPlaneLength, -playPlanePos);
    var linePlane = createPlayPlane(0xFFFFFF, CENTERLINE_WIDTH, 0);

    scene.add(backPlane);
    scene.add(frontPlane);
    scene.add(linePlane);
}

function createPlayPlane(color, length, offset) {
    var geometry = new THREE.PlaneGeometry(PLAYFIELD_WIDTH, length);
    var material = new THREE.MeshLambertMaterial({color: color});
    var plane = new THREE.Mesh(geometry, material);
    plane.material.side = THREE.DoubleSide;
    plane.receiveShadow = true;
    plane.position.set(0, offset,0);

    return plane;
}

function createWalls() {
    var leftWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, 1);
    var leftWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-PLAYFIELD_WIDTH / 2 - (WALL_WIDTH/2), 0, WALL_WIDTH);
    leftWall.castShadow = true;
    scene.add(leftWall);

    var rightWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, 1);
    var rightWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(PLAYFIELD_WIDTH / 2 + (WALL_WIDTH/2), 0, WALL_WIDTH);
    rightWall.castShadow = true;
    scene.add(rightWall);
}

function createPaddles() {

}

function createScoreBoard() {

}

function createBall() {

}

function createSpotlight() {
    // We choose directional light as it can be used to simulate sunlight.
    // See three.js documentation.

    var light = new THREE.DirectionalLight(0xffffff, 1.4);
    light.position.set(-7, 0, 8);
    light.castShadow = true; // expensive
    light.shadowCameraVisible = true;
    light.shadowDarkness = 0.00;
    light.shadowCameraNear = 6;
    light.shadowCameraFar = camera.far;
    light.shadow.mapSize.width = 10;
    light.shadow.mapSize.height = 10;
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

    var hemiHelper = new THREE.HemisphereLightHelper(hemiLight);
    scene.add(hemiHelper);
}