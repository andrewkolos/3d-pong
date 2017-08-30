// perspective camera
const VIEW_ANGLE = 45;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 10000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

var scene;
var renderer;
var camera;


var playerPaddle;
var computerPaddle;
var ball;