const resetGame = () => {
  //game setup
  playerCount = 0;
  players = { };

  up = false;
  left = false;
  right = false;
  down = false;
};

const startGame = () => {
  //assign game key/mouse events
  setupEvents();
  
  console.log('starting up game');
  
  //game setup
  //TODO setup game stuff
  
  //go to game loop
  gameState = STATES.game;
  
  //todo replace with react call
  //showLoginBox();
}; //setup and start the game

const doOnPreloadDone = () => {
  console.log('done loading images');
  gameState = STATES.title;
  assignStartupEvents();
  
  cursor = new Sprite({sheet: ANIMATIONS.cursor });
  setAnim(cursor, 'default', 'default');
  
  // gacha sprite
  gacha = new Sprite({sheet: ANIMATIONS.gacha });
  setAnim(gacha, 'default', 'pingPong');
  gacha.x = 10; gacha.y = height-gacha.height-10;
  capsule = new Sprite({sheet: ANIMATIONS.capsule });
  setAnim(capsule, 'default', 'pingPong');
  capsule.x = canvas.width/2-capsule.width/2; capsule.y = canvas.height/2-110;
  
  document.onmousemove = doOnMouseMove;
  document.onmousedown = doOnMouseDown;
  document.onmouseup = doOnMouseUp;
  document.onmouseout = doOnMouseOut;
  document.onmousein = doOnMouseIn;
};

const suspendPlayerControls = () => {
  document.onkeydown = undefined;
  document.onkeyup = undefined;
}; 
const restorePlayerControls = () => {
  document.onkeydown = keyDownHandler;
  document.onkeyup = keyUpHandler;
}; 

//--GAME LOOPS---------------------region
const waitLoop = () => {
  drawWait();
  console.log('waiting for connection to server...');
} //wait until client joined the server

const preloadLoop = () => {
  //check if images are loaded then go to startup
  if(loadQueue == numLoaded){
    doOnPreloadDone();
    return;
  }
  
  drawPreload();
  
  console.log('loading game...');
};

const titleLoop = () => {
  drawTitle(); playAnim(ctx, capsule);
};

const gameOverLoop = () => {
  drawGameOver();
  
  console.log('game over');
};

const gameUpdateLoop = () => {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx_overlay.clearRect(0,0,canvas_overlay.width,canvas_overlay.height);
  
  drawPlaceholder();
  
  //check player input
  
  //update game
  
  //draw game
  drawPlayers();
  
  playAnim(ctx, gacha);
  
  drawGameUI();
};

//endregion