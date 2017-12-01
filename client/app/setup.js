//--initial game setup-------------------region
const setupCanvas = () => {
  canvas = document.querySelector('#canvas_main');
  ctx = canvas.getContext('2d');
  canvas_overlay = document.querySelector('#canvas_overlay');
  ctx_overlay = canvas_overlay.getContext('2d');
  canvas_back = document.querySelector('#canvas_back');
  ctx_back = canvas_back.getContext('2d');
  
  width = canvas.width;
  height = canvas.height;
};

//--events-------------------------region
const setupEvents = () => {
  document.onkeydown = keyDownHandler;
  document.onkeyup = keyUpHandler;
  
  //find the mouse position
  canvas_overlay.onmousemove = doOnMouseMove;
  //console.log('assigned startup game keys');
}; //events for gameplay

const assignStartupEvents = () => {
  if(gameState === STATES.title){
    document.onkeyup = () => {
      removeStartupEvents();
      gameState = STATES.setupGame;
      console.log('setting up game')
    }
    canvas_overlay.onmousedown = () => {
      removeStartupEvents();
      gameState = STATES.setupGame; 
      console.log('setting up game')
    }
  }
  //console.log('assigned pregame keys');
} //event to start game
const removeStartupEvents = () => {
  //console.log('removed pregame keys');
  if(gameState === STATES.title){
    document.onkeyup = undefined;
    canvas_overlay.onmousedown = undefined;
  }
} //remove those events

//endregion