let mouse = { x:0, y:0 };

let paused = false, debug = true;

let user = {};
let players = {};
let playerCount = 0;

let gacha = undefined, capsule = undefined;
let slimes = {};

//handle for key down events
const keyDownHandler = (e) => {
  var keyPressed = e.which;

  // W OR UP
  if(keyPressed === 38) {
    //console.log('up key');
    e.preventDefault();
  }
  // A OR LEFT
  else if(keyPressed === 37) {
    //console.log('left key');
    e.preventDefault();
  }
  // S OR DOWN
  else if( keyPressed === 40) {
    //console.log('down key');
    e.preventDefault();
  }
  // D OR RIGHT
  else if(keyPressed === 39) {
    //console.log('right key');
    e.preventDefault();
  }
};

const init = () => {
  //setupCanvas(); 
  setupSockets();
  
  window.onkeydown = keyDownHandler;
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
  //pauseGame();
  //console.log('blur');
}
//ONFOCUS
window.onfocus = function() {
  //resumeGame();
  //console.log('focus');
};