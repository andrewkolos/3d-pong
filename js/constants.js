const DEBUG = true;

// perspective camera
const VIEW_ANGLE = 45;
const ASPECT_RATIO = window.innerWidth / window.innerHeight;
const NEAR_CLIPPING_PLANE = 0.1;
const FAR_CLIPPING_PLANE = 1000;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const CAMERA_X = 0;
const CAMERA_Y = -20 * 2;
const CAMERA_Z = 10 * 2;

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

const SCOREBOARD_WIDTH = 15;
const SCOREBOARD_HEIGHT = 0.5;
const SCOREBOARD_DEPTH = 5.25;
const SCOREBOARD_POS_X = 0;
const SCOREBOARD_POS_Y = 30;
const SCOREBOARD_POS_Z = 5;
const SCOREBOARD_COLOR = 0x009688;