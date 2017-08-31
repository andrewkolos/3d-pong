function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    camera.position.set(CAMERA_X, CAMERA_Y, CAMERA_Z);
    camera.lookAt(scene.position);


    scene.add(camera);

    createPlayField();

    createWalls();

    createPaddles();

    createScoreBoard();

    createBall();

    createSpotlight();

    document.body.appendChild(renderer.domElement);

    renderer.render(scene, camera);
}

function createPlayField() {
    var geometry = new THREE.PlaneGeometry(PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);
    var material = new THREE.MeshLambertMaterial({color: 0x156289});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0,0,0);

    var lineGeometry = new THREE.PlaneGeometry(10, 0.5);
    var lineMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    var line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(0, plane.position.x + 0.2, 0);

    scene.add(plane);
    scene.add(line);
}

function createWalls() {
    var leftWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, 1);
    var leftWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-PLAYFIELD_WIDTH / 2 - (WALL_WIDTH/2), 0, WALL_WIDTH);
    scene.add(leftWall);

    var rightWallGeometry = new THREE.BoxGeometry(WALL_WIDTH, PLAYFIELD_HEIGHT, 1);
    var rightWallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
    var rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
    rightWall.position.set(PLAYFIELD_WIDTH / 2 + (WALL_WIDTH/2), 0, WALL_WIDTH);
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

    var light = new THREE.DirectionalLight(0xffffff, 2);
    light.castShadow = true; // expensive
    light.position.set(-5, 1, 5);
    //light.shadowCameraNear = 20;
    //light.shadowCameraFar = 50;
    scene.add(light);

    var dirHelper = new THREE.DirectionalLightHelper(light);
    scene.add(dirHelper);

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 0, 10 );
    scene.add( hemiLight );

    var hemiHelper = new THREE.HemisphereLightHelper(hemiLight);
    scene.add(hemiHelper);
}