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

var updateBallSpeed = function(ballSpeed, disableSpeedMeter) {};
var updateBallProgress = function(ballProgress, disableProgressMeter) {};