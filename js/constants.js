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
const PADDLE_HEIGHT = 0.5 * 0.25;
const PADDLE_DEPTH = 1;
const PADDLE_PLAYER_COLOR = 0x0D47A1;
const PADDLE_COMPUTER_COLOR = 0xB71C1C;

const BALL_RADIUS = 0.3*1.5;
const BALL_NUM_SEGMENTS = 64;
const BALL_IFRAMES = 15;
const BALL_SPEED_LIMIT = 1;

const SCOREBOARD_WIDTH = 10;
const SCOREBOARD_HEIGHT = 0.5;
const SCOREBOARD_DEPTH = 5.25;
const SCOREBOARD_POS_X = 0;
const SCOREBOARD_POS_Y = 30;
const SCOREBOARD_POS_Z = 2;
const SCOREBOARD_COLOR = 0xFFFFFF;
const SCOREBOARD_PADDING = 0.5;

const BALL_SPEED_METER_WIDTH = 8;
const BALL_SPEED_METER_HEIGHT = 1.5;
const BALL_SPEED_METER_POS_X = 0;//3;
const BALL_SPEED_METER_POS_Y = 29.5;
const BALL_SPEED_METER_POS_Z = 1.1;
const BALL_SPEED_METER_COLOR = 0x111111;
const BALL_SPEED_METER_PART_COLORS = [0x14a800, 0x1adb00, 0xb9f600, 0xe9f500, 0xf6f600, 0xf67b00, 0xf70000 ];
const BALL_PROGRESS_METER_PART_COLORS = [0x222222, 0x444444, 0x666666, 0x888888, 0xaaaaaa, 0xcccccc, 0xeeeeee ];
const BALL_SPEED_METER_SEPARATOR_SIZE = 0.2;

const PADDLE_PLAYER_MOVESPEED = 0.06 * 2.5;
const PADDLE_COMPUTER_MOVESPEED = 0.06 * 2.1;
const BALL_SPEED_INCREASE_ON_PADDLE_HIT = 0.005;
const INIT_DX = 0.08;
const MAX_DX = 0.14;
const MIN_DX = 0.04 ;
const INIT_DY = 0.10;

const COMPUTER_IMPACT_SPEEDUP = 1.0;
const PLAYER_IMPACT_SPEEDUP = 0.6;
const BALL_SPEED_METER_MIN_SPEED = 0.05;
const BALL_SPEED_METER_MAX_SPEED = 0.8;

const SHAKE_SPEED_MIN = 0.55;
const SHAKE_SPEED_MAX = 1.4;
const SHAKE_MAX_X = 0.2;
const SHAKE_MAX_Y = 0.2;
const SHAKE_MAX_Z = 0.2;

const NUM_FRAMES_PAUSE_AFTER_SCORE = 120;