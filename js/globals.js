var scene;
var renderer;
var camera;
var cameraParent;

var controls;
var stats;

var playerPaddle;
var computerPaddle;
var ball;
var ballInner;

var dx;
var dy;
var pause;
var server;
var stillCollidingWithPlayer;
var stillCollidingWithWall;

var scoreboardBase;
var playerScore = 0;
var playerScoreDisplay;
var computerScore = 0;
var computerScoreDisplay;
var playerScoreMesh;
var computerScoreMesh;

var sound_applause1;
var sound_applause2;
var sound_winner;
var sound_loser;

var sounds_hits;
var sounds_cheers;

var gamepad;

var gui;
var colorFolder;
var difficultyFolder;

var directionalLightBrightness;
var ambientLightBrightness;
var scoreboardLightBrightness;

var dirLight1;
var hemiLight;
var ambientLight;
var scoreboardLight;
var dirHelper;
var dirShadow;
var hemiHelper;
var ambientLightHelper;
var scoreboardHelper;
var scoreboardShadow;


function intColorToCssString(color) {
                             // convert to hex string  // remove extra 0's
    color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
    return color;
}

function cssStringToColor(color) {
    color = color.replace('#', '0x');
    var colorObject = new THREE.Color(parseInt(color));
    return colorObject;
}

var config = {
    playerColor: intColorToCssString(PADDLE_PLAYER_COLOR, false),
    playerSpeed: PADDLE_PLAYER_BASELINE_MOVESPEED,
    directionalLight: INIT_DIR_LIGHT_BRIGHTNESS,
    hemisphereLight: INIT_HEMI_LIGHT_BRIGHTNESS,
    scoreLight: INIT_SCORE_LIGHT_BRIGHTNESS,
    ambientLight: INIT_AMBIENT_LIGHT_BRIGHTNESS,
    lightHelpers: false,
    computerColor: intColorToCssString(PADDLE_COMPUTER_COLOR, false),
    computerSpeed: PADDLE_COMPUTER_BASELINE_MOVESPEED,
    musicVolume: 1,
    soundVolume: 1,
    resetGame: function () {
        playerScore = 0;
        computerScore = 0;
        playerScoreDisplay.setNumber(playerScore);
        computerScoreDisplay.setNumber(playerScore);
        dx = INIT_DX;
        dy = INIT_DY;
        pause = 120;
        server = 2;
        stillCollidingWithPlayer = false;
        ball.position.set(0, 0, BALL_RADIUS);
        stillCollidingWithWall = false;
        playerPaddle.position.set(0, -(PLAYFIELD_HEIGHT / 2) + PADDLE_HEIGHT / 2, PADDLE_DEPTH/2);
        playerPaddle.rotation.z = 0;
    },
    resetCamera: function() {controls.reset()},
    CONTROLS: function() {
        alert("Move using W/S/A/D. Rotate using Q,E or LEFT/UP/RIGHT.\n\n" +
              "The camera can be adjusted with the mouse buttons and scroll wheel.\n\n"+
             "If you have an Xbox controller, try plugging it in and restarting the browser! Use the left stick to move, and the right to tilt.");
    }
};

var sound_targets_start;
var sound_targets_loop;
var paddleComputerMoveSpeed = PADDLE_COMPUTER_BASELINE_MOVESPEED;
var paddlePlayerMoveSpeed = PADDLE_PLAYER_BASELINE_MOVESPEED;

var updateBallSpeed = function (ballSpeed, disableSpeedMeter) {
};
var updateBallProgress = function (ballProgress, disableProgressMeter) {
};