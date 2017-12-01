let canvas, ctx, canvas_overlay, ctx_overlay, canvas_back, ctx_back, width, height, animationFrame;

let socket, hash, username;

let bgAudio = undefined, effectAudio = undefined, currentEffect = 0, currentDirection = 1;

let mouse = { x:0, y:0 };
let IMAGES = {};
let ANIMATIONS = {};
let cursor = undefined;
let dragging = false;

let STATES = {
  wait: 'wait',
  preload: 'preload',
  title: 'title',
  setupGame: 'setupGame',
  game: 'game',
  gameover: 'gameover',
};
let gameState = STATES.wait;
let paused = false, debug = true;

let user = {};
let players = {};
let playerCount = 0;

let gacha = undefined, capsule = undefined;
let slimes = {};

let up = false;
let down = false;
let right = false;
let left = false;

//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    // move character up
    up = true;
    e.preventDefault();
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    // move character left
    left = true;
    e.preventDefault();
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    // move character down
    down = true;
    e.preventDefault();
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    //move character right
    right = true;
    e.preventDefault();
  }
};

//handler for key up events
const keyUpHandler = (e) => {
  var keyPressed = e.which;

  // W OR UP
  if(keyPressed === 87 || keyPressed === 38) {
    // stop character from moving up
    up = false;
  }
  // A OR LEFT
  else if(keyPressed === 65 || keyPressed === 37) {
    // stop character from moving left
    left = false;
  }
  // S OR DOWN
  else if(keyPressed === 83 || keyPressed === 40) {
    // stop character from moving down
    down = false;
  }
  // D OR RIGHT
  else if(keyPressed === 68 || keyPressed === 39) {
    // stop character from moving right
    right = false;
  }
};

const test = () => { console.log('test!'); };

const doOnMouseMove = (e) => {
  mouse = getMouse(e);
  cursor.x = mouse.x;
  cursor.y = mouse.y;
}
const emptyFunct = () => { };
const doOnMouseDown = (e) => { 
  setAnim(cursor, 'click', 'once' );
  dragging = true;
}
const doOnMouseUp = (e) => { 
  setAnim(cursor, 'click', 'onceReverse', () =>  setAnim(cursor, 'default', 'default'));
  dragging = false;
}
const doOnMouseOut = (e) => { dragging = false; suspendPlayerControls(); }
const doOnMouseIn = (e) => { restorePlayerControls(); }

const stateHandler = () => {
  ctx_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);

  if(gameState === STATES.wait){
    waitLoop();
  } 
  else if(gameState === STATES.preload){
    preloadLoop();
  } 
  else if(gameState === STATES.setupGame){
    startGame();
  } 
  else if(gameState === STATES.title){
    titleLoop();
  } 
  else if(gameState === STATES.game){
    gameUpdateLoop();
  } 
  else if(gameState === STATES.gameover){
    gameOverLoop();
  }
  
  if(cursor != undefined){
    playAnim(ctx_overlay, cursor);
  } 
  
  animationFrame = requestAnimationFrame(stateHandler);
}

const submitLogin = () => {
  //hideLoginBox();
  //username = document.querySelector('#test-login-name').value;
  //todo send ajax request here
};

const init = () => {
  setupCanvas(); 
  setupSockets();
  
  //get user
  
  
  resetGame();
  
  setupSound();
  
  preloadImages(toLoadImgs, IMAGES);
  preloadImages(toLoadAnims, ANIMATIONS);
  animationFrame = requestAnimationFrame(stateHandler);
  
  //play audio
  playBgAudio();
};

//window.onload = init;

const pauseGame = () => {
  paused = true;
  //stop animation loop
  cancelAnimationFrame(animationFrame);
  
  stopBgAudio();
};

const resumeGame = () => {
  //stop animation loop just in case
  cancelAnimationFrame(animationFrame);
  
  playBgAudio();
  paused = false;
  
  //call update
  requestAnimationFrame(stateHandler);
};

const toggleDebug =  () => {
  if(debug){
    debug = false;
    return;
  }
  debug = true;
};

//ONBLUR
window.onblur = function() { 
  pauseGame();
  //console.log('blur');
}
//ONFOCUS
window.onfocus = function() {
  resumeGame();
  //console.log('focus');
};