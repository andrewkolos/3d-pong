var scene;
var renderer;
var camera;
var cameraParent;


var playerPaddle;
var computerPaddle;
var ball;
var ballInner;

var scoreboardBase;
var playerScore = 0;
var playerScoreDisplay;
var computerScore = 0;
var computerScoreDisplay;

var scoreboardLight;

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

function parseColor  (color, toNumber) {
    if (toNumber === true) {
        if (typeof color === 'number') {
            return (color | 0); //chop off decimal
        }
        if (typeof color === 'string' && color[0] === '#') {
            color = color.slice(1);
        }
        return window.parseInt(color, 16);
    } else {
        if (typeof color === 'number') {
            //make sure our hexadecimal number is padded out
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        }

        return color;
    }
}

function cssStringToColor(color) {
    color = color.replace('#', '0x');
    var colorObject = new THREE.Color(parseInt(color));
    return colorObject;
}

var config = {
    playerColor: parseColor(PADDLE_PLAYER_COLOR, false),
    playerSpeed: PADDLE_PLAYER_MOVESPEED,
    computerColor: parseColor(PADDLE_COMPUTER_COLOR, false),
    computerSpeed: PADDLE_COMPUTER_MOVESPEED,
    musicVolume : 1,
    swooce: function() {
        console.log('swooce');
    },
};

var sound_targets_start;
var sound_targets_loop;

var updateBallSpeed = function(ballSpeed, disableSpeedMeter) {};
var updateBallProgress = function(ballProgress, disableProgressMeter) {};