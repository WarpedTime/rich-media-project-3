// when we receive character updates from the server
const update = (data) => {
  
};

const setUser = (data) => {
  hash = data.hash; // set this client's hash to the unique hash the server gives them
  players[data.hash] = data.hash;
  playerCount += 1;

  console.log( data.name + ' [you] joined server');
  gameState = STATES.preload // start animating;
};

const setOtherUser = (data) => {
  players[data.hash] = data;
  playerCount += 1;
  
  console.log( data.name + ' joined server');
};

const removeUser = (data) => {
  hash = 0; // set this client's hash to the unique hash the server gives them
  players = { };
  playerCount = 0;

  console.log( data.name + ' [you] left the server');
};

const removeOtherUser = (data) => {
  delete players[data.hash];
  playerCount -= 1;
  
  console.log( data.name + ' left the server');
};

// update this client's position and send to server
const updatePosition = () => {
    let plr = players[hash];

    //plr.alpha = 0.05;
    //plr.lastUpdate = new Date().getTime();
};

// move the sphere arround
const movement = () => {

};

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
  
  //play audio
  playBgAudio();
  
  //go to game loop
  gameState = STATES.game;
  
  showLoginBox();
}; //setup and start the game

const doOnPreloadDone = () => {
  console.log('done loading images');
  gameState = STATES.title;
  assignStartupEvents();
  
  cursor = new Sprite({sheet: ANIMATIONS.cursor });
  setAnim(cursor, 'default', 'default');
  
  document.onmousemove = doOnMouseMove;
  document.onmousedown = doOnMouseDown;
  document.onmouseup = doOnMouseUp;
  document.onmouseout = doOnMouseOut;
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
  drawTitle();
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
  updatePosition();
  movement();
  
  //draw game
  drawPlayers();
};

//endregion