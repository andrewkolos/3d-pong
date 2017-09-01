const DEBUG = false;

// perspective camera
const VIEW_ANGLE = 45;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 1000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CAMERA_X = 0;
const CAMERA_Y = -20;
const CAMERA_Z = 10;

const PLAYFIELD_WIDTH = 10;
const PLAYFIELD_HEIGHT = 20;
const PLAYFIELD_COLOR = 0x156289;

const CENTERLINE_WIDTH = 0.5;

const WALL_WIDTH = 0.5;
const WALL_HEIGHT = 1;
const WALL_COLOR = 0xffffff;

const PADDLE_WIDTH = 2;
const PADDLE_HEIGHT = 0.5;
const PADDLE_DEPTH = 1;
const PADDLE_PLAYER_COLOR = 0x0D47A1;
const PADDLE_COMPUTER_COLOR = 0xB71C1C;

const BALL_RADIUS = 0.3;
const BALL_COLOR = 0x311B92;
const BALL_NUM_SEGMENTS = 64;

const SCOREBOARD_WIDTH = 24;
const SCOREBOARD_HEIGHT = 0.5;
const SCOREBOARD_DEPTH = 5.25;
const SCOREBOARD_POS_X = 0;
const SCOREBOARD_POS_Y = 30;
const SCOREBOARD_POS_Z = 2;
const SCOREBOARD_COLOR = 0xFFEE58;

const PADDLE_PLAYER_MOVESPEED = 0.06;
const PADDLE_COMPUTER_MOVESPEED = 0.069;
const BALL_SPEED_INCREASE_ON_PADDLE_HIT = 0.005;
const INIT_DX = 0.08;
const MAX_DX = 0.14;
const MIN_DX = 0.04 ;
const INIT_DY = 0.10;

const NUM_FRAMES_PAUSE_AFTER_SCORE = 60;