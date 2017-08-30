function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMapEnabled = true;

    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT_RATIO, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
    camera.position.set(0, -20, 10);
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
    var geometry = new THREE.PlaneGeometry(10, 20);
    var material = new THREE.MeshLambertMaterial({color: 0x156289});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0,0,0);

    var lineGeometry = new THREE.PlaneGeometry(10, 0.5);
    var lineMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    var line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.position.set(0, 0.2, 0);

    scene.add(plane);
    scene.add(line);
}

function createWalls() {
    var leftWallGeometry = new THREE.BoxGeometry(1, 20, 1);
    var leftWallMaterial = new THREE.MeshLambertMaterial({color: 0xd1ffde});
    var leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
    leftWall.position.set(-5.5, 0, 0.5);
    scene.add(leftWall);
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
    light.position.set(10, 20, 20);
    //light.shadowCameraNear = 20;
    //light.shadowCameraFar = 50;
    scene.add(light);
}