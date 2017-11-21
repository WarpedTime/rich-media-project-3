'use strict';

var drawPlayers = function drawPlayers(time) {
  //draw things
  var keys = Object.keys(players);
  for (var i = 0; i < keys.length; i++) {
    var playerdrawn = players[keys[i]];
    drawPlayer(playerdrawn);
  }
}; //draw all players in the players list

var drawPlayer = function drawPlayer(playerdrawn) {
  ctx.save();
  ctx.beginPath();

  ctx.fillStyle = playerdrawn.style;
  ctx.arc(playerdrawn.x, playerdrawn.y, playerdrawn.radius, 0, Math.PI * 2, false);

  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

//--draw game screens-------------
var drawPlaceholder = function drawPlaceholder() {
  ctx_back.fillStyle = '#626262';
  ctx_back.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '15pt Courier';
  ctx.fillStyle = 'white';
  ctx.fillText('There is nothing here yet', canvas.width / 2, canvas.height / 2);

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('user: [' + username + ']', 50, 50);
}; //just a placeholder screen

var drawPreload = function drawPreload() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '15pt Courier';
  ctx.fillStyle = 'white';
  ctx.fillText('Loading App...', canvas.width / 2, canvas.height / 2);
}; //loading images screen

var drawWait = function drawWait() {
  ctx_back.fillStyle = 'black';
  ctx_back.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '15pt Courier';
  ctx.fillStyle = 'white';
  ctx.fillText('waiting for connection ro server...', canvas.width / 2, canvas.height / 2);
}; //waiting for server connction

var drawTitle = function drawTitle() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.font = '30pt Courier';
  ctx.fillText('some game title', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '15pt Courier';
  ctx.fillText('- Click or press any button to play! -', canvas.width / 2, canvas.height / 2 + 40);
  ctx.drawImage(IMAGES.logo.img, canvas.width / 2 - 25, canvas.height / 2 - 100);
}; //app title screen

var drawGameOver = function drawGameOver() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'white';
  ctx.font = '30pt Courier';
  ctx.fillText('Game Ended', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '15pt Courier';
  ctx.fillText('- Click or press any button to play again! -', canvas.width / 2, canvas.height / 2 + 40);
  ctx.drawImage(IMAGES.logo.img, canvas.width / 2 - 25, canvas.height / 2 - 100);
}; //game over screen
'use strict';

var getMouse = function getMouse(e) {
  var offset = canvas_overlay.getBoundingClientRect();
  return {
    x: e.clientX - offset.left,
    y: e.clientY - offset.top
  };
};
var lerp = function lerp(v0, v1, alpha) {
  return (1 - alpha) * v0 + alpha * v1;
};
var calculateDT = function calculateDT() {
  var now, fps;
  now = performance.now();
  fps = 1000 / (now - undefined.lastTime);
  fps = clampValue(fps, 12, 60);
  undefined.lastTime = now;
  return 1 / fps;
};
var clampValue = function clampValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
};

//--collision---------------------------------------
//check if point is in square [box]: {x, y, height, width}
var isInBounds = function isInBounds(point, box) {
  if (point.y < box.y || point.y > box.y + box.height || point.x < box.x || point.x > box.x + box.width) {
    return false;
  }
  return true;
};

//check if point is in circle bounds [circle]: {x, y, radius}
var isInCircle = function isInCircle(point, circle) {
  var dx = point.x - circle.x;
  var dy = point.y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
};

//check circle x circle intersections [circle]: {x, y, radius}
var circlesIntersect = function circlesIntersect(c1, c2) {
  var dx = c2.x - c1.x;
  var dy = c2.y - c1.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
};

//--draw--------------------------------------------
var fillText = function fillText(targetCtx, string, x, y, font, color, center) {
  targetCtx.save();
  if (center) {
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'middle';
  };
  targetCtx.font = font;
  targetCtx.fillStyle = color;
  targetCtx.fillText(string, x, y);
  targetCtx.restore();
};

var drawRoundedRect = function drawRoundedRect(x, y, w, h, amt, targetCtx, stroke) {
  targetCtx.save();
  //targetCtx.fillRect(x,y,w,h);
  if (amt * 2 >= h) {
    amt = h / 2;
  }
  if (amt * 2 >= w) {
    amt = w / 2;
  }

  w -= amt * 2;
  h -= amt * 2;

  targetCtx.beginPath();
  targetCtx.moveTo(x + amt, y); //top left inner

  targetCtx.lineTo(x + w + amt, y); //top side
  targetCtx.quadraticCurveTo(x + w + amt * 2, y, x + w + amt * 2, y + amt); //top right corner

  targetCtx.lineTo(x + w + amt * 2, y + h + amt); //right side
  targetCtx.quadraticCurveTo(x + w + amt * 2, y + h + amt * 2, x + w + amt, y + h + amt * 2); //bottom right corner

  targetCtx.lineTo(x + amt, y + h + amt * 2); //bottom side
  targetCtx.quadraticCurveTo(x, y + h + amt * 2, x, y + h + amt); //bottom right corner

  targetCtx.lineTo(x, y + amt); //left side
  targetCtx.quadraticCurveTo(x, y, x + amt, y); //bottom left corner

  targetCtx.fill();
  if (stroke) targetCtx.stroke();
  targetCtx.restore();
};

//draw a ui (top-canvas) button [button]: {x, y, height, width}
var drawButton = function drawButton(button, text, color) {
  ctx_top.fillStyle = color || button.color;
  ctx_top.lineWidth = 1.5;
  drawRoundedRect(button.x, button.y, button.width, button.height, 3, ctx_top, true);
  fillText(ctx_top, text || button.text, button.x + button.width / 2, button.y + button.height / 2, 'bold 13pt Trebuchet MS', button.textColor || 'black', true);
};

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.replace(/\n/g, " \n ").split(" ");
  var line = '';

  var totalheight = lineHeight;
  var starty = y;

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;

    if (words[n] === '\n') {
      context.fillText(line, x, y);
      line = '';
      y += lineHeight;
      totalheight += lineHeight;
    } else if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      totalheight += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  context.fillRect(x - 5, starty, 3, totalheight);

  return totalheight;
}
'use strict';

var canvas = void 0,
    ctx = void 0,
    canvas_overlay = void 0,
    ctx_overlay = void 0,
    canvas_back = void 0,
    ctx_back = void 0,
    width = void 0,
    height = void 0,
    animationFrame = void 0;

var socket = void 0,
    hash = void 0,
    username = void 0;

var bgAudio = undefined,
    effectAudio = undefined,
    currentEffect = 0,
    currentDirection = 1;

var mouse = { x: 0, y: 0 };
var IMAGES = {};
var ANIMATIONS = {};
var cursor = undefined;
var dragging = false;

var STATES = {
  wait: 'wait',
  preload: 'preload',
  title: 'title',
  setupGame: 'setupGame',
  game: 'game',
  gameover: 'gameover'
};
var gameState = STATES.wait;
var paused = false,
    debug = true;

var players = {};
var playerCount = 0;
var bulletArray = [];

var up = false;
var down = false;
var right = false;
var left = false;

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    // move character up
    up = true;
    e.preventDefault();
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      // move character left
      left = true;
      e.preventDefault();
    }
    // S OR DOWN
    else if (keyPressed === 83 || keyPressed === 40) {
        // move character down
        down = true;
        e.preventDefault();
      }
      // D OR RIGHT
      else if (keyPressed === 68 || keyPressed === 39) {
          //move character right
          right = true;
          e.preventDefault();
        }
};

//handler for key up events
var keyUpHandler = function keyUpHandler(e) {
  var keyPressed = e.which;

  // W OR UP
  if (keyPressed === 87 || keyPressed === 38) {
    // stop character from moving up
    up = false;
  }
  // A OR LEFT
  else if (keyPressed === 65 || keyPressed === 37) {
      // stop character from moving left
      left = false;
    }
    // S OR DOWN
    else if (keyPressed === 83 || keyPressed === 40) {
        // stop character from moving down
        down = false;
      }
      // D OR RIGHT
      else if (keyPressed === 68 || keyPressed === 39) {
          // stop character from moving right
          right = false;
        }
};

var doOnMouseMove = function doOnMouseMove(e) {
  mouse = getMouse(e);
  cursor.x = mouse.x;
  cursor.y = mouse.y;
};

var test = function test() {
  console.log('test!');
};
var emptyFunct = function emptyFunct() {};
var doOnMouseDown = function doOnMouseDown(e) {
  setAnim(cursor, 'click', 'once');
  dragging = true;
};
var doOnMouseUp = function doOnMouseUp(e) {
  setAnim(cursor, 'click', 'onceReverse', function () {
    return setAnim(cursor, 'default', 'default');
  });
  dragging = false;
};
var doOnMouseOut = function doOnMouseOut(e) {
  dragging = false;
};

var stateHandler = function stateHandler() {
  if (gameState === STATES.wait) {
    waitLoop();
  } else if (gameState === STATES.preload) {
    preloadLoop();
  } else if (gameState === STATES.setupGame) {
    startGame();
  } else if (gameState === STATES.title) {
    titleLoop();
  } else if (gameState === STATES.game) {
    gameUpdateLoop();
  } else if (gameState === STATES.gameover) {
    gameOverLoop();
  }

  if (cursor != undefined) {
    ctx_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);
    playAnim(ctx_overlay, cursor);
  }

  animationFrame = requestAnimationFrame(stateHandler);
};

var submitLogin = function submitLogin() {
  hideLoginBox();
  username = document.querySelector('#test-login-name').value;
};

var init = function init() {
  setupCanvas();
  setupSockets();

  resetGame();

  setupSound();

  preloadImages(toLoadImgs, IMAGES);
  preloadImages(toLoadAnims, ANIMATIONS);
  animationFrame = requestAnimationFrame(stateHandler);
};

window.onload = init;

var pauseGame = function pauseGame() {
  paused = true;
  //stop animation loop
  cancelAnimationFrame(animationFrame);

  stopBgAudio();
};

var resumeGame = function resumeGame() {
  //stop animation loop just in case
  cancelAnimationFrame(animationFrame);

  playBgAudio();
  paused = false;

  //call update
  requestAnimationFrame(stateHandler);
};

var toggleDebug = function toggleDebug() {
  if (debug) {
    debug = false;
    return;
  }
  debug = true;
};

var showLoginBox = function showLoginBox() {
  document.querySelector('#test-login').classList.remove('hidden');
  document.querySelector('#login-submit').onclick = submitLogin;

  document.querySelector('#signup-tab').onclick = function () {
    document.querySelector('#login').classList.add('hidden');
    document.querySelector('#signup').classList.remove('hidden');

    document.querySelector('#signup-tab').classList.remove('inactive');
    document.querySelector('#login-tab').classList.add('inactive');
  };
  document.querySelector('#login-tab').onclick = function () {
    document.querySelector('#login').classList.remove('hidden');
    document.querySelector('#signup').classList.add('hidden');

    document.querySelector('#signup-tab').classList.add('inactive');
    document.querySelector('#login-tab').classList.remove('inactive');
  };
  suspendPlayerControls();
  removeStartupEvents();
};
var hideLoginBox = function hideLoginBox() {
  document.querySelector('#test-login').classList.add('hidden');
  restorePlayerControls();
  assignStartupEvents();
};

//ONBLUR
window.onblur = function () {
  pauseGame();
  //console.log('blur');
};
//ONFOCUS
window.onfocus = function () {
  resumeGame();
  //console.log('focus');
};
"use strict";

//--vars-----------------------------region
var bgTracks = {
  floralLife: { src: 'assets/audio/Floral Life (Henesys).mp3', lastTime: 0 },
  current: {}
};
var effectSounds = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3", "8.mp3"];

//image preloading vv
var loadQueue = -1;
var numLoaded = 0;

var toLoadImgs = [{
  name: 'logo',
  url: 'assets/img/logo.png'
}];
var toLoadAnims = [{
  name: 'cursor',
  url: 'assets/img/cursor.png',
  animData: {
    default: {
      row: 1,
      cols: 4,
      total: 4,
      playSpeed: 16,
      height: 50,
      width: 50
    },
    availible: {
      row: 2,
      cols: 3,
      playSpeed: 10
    },
    unavailible: {
      row: 3,
      cols: 3,
      playSpeed: 10
    },
    click: {
      row: 4,
      cols: 3,
      playSpeed: 4
    }
  }
}, {
  name: 'logo',
  url: 'assets/img/logo.png'
}];
//endregion

//--image preloader-----------------region
var preloadImages = function preloadImages(imgArr, targetList) {
  if (loadQueue === -1) loadQueue = 0;
  targetList.toloadcount = 0;
  targetList.loadcount = 0;

  var _loop = function _loop(i) {
    var data = imgArr[i];

    var img = new Image();
    img.src = data.url;
    targetList.toloadcount++;
    loadQueue++;
    //console.log(`toloadcount: ${targetList.toloadcount}`);

    img.onload = function (e) {
      targetList[data.name] = {
        img: img,
        name: data.name,
        height: img.naturalHeight,
        width: img.naturalWidth
      };
      if (data.animData) targetList[data.name].animData = data.animData;

      targetList.loadcount++;
      numLoaded++;
      //console.log(`loaded: ${data.name}, loadcount: ${targetList.loadcount}, anim?: ${data.animData}`);
    };
  };

  for (var i = 0; i < imgArr.length; i++) {
    _loop(i);
  }
};
//endregion

//--animation/sprites----------------------region
var Sprite = function Sprite(data) {
  var sprite = {};

  var sheet = data.sheet;
  sprite.sheet = sheet;
  sprite.animData = sheet.animData;
  sprite.filter = 0;
  sprite.x = data.x || 0;
  sprite.y = data.y || 0;

  sprite.width = sheet.animData.default.width || sheet.width / sheet.animData.default.cols;
  sprite.height = sheet.animData.default.height || sheet.height / sheet.animData.default.total;
  sprite.z = data.z || 0;

  sprite.frameCount = 0;
  sprite.frame = 0;
  sprite.currentAnim = {
    name: 'default',
    onDone: emptyFunct
  };
  sprite.playSpeed = sheet.animData.default.speed || 14;
  sprite.playStyle = false;

  sprite.moveUp = false;
  sprite.moveLeft = false;
  sprite.moveRight = false;
  sprite.moveDown = false;
  sprite.playDir = -1;

  setAnim(sprite, 'default');

  return sprite;
};

var setAnim = function setAnim(targetSprite, anim, playStyle, onDone) {
  targetSprite.frameWidth = targetSprite.sheet.width / targetSprite.animData[anim].cols;

  targetSprite.frameHeight = targetSprite.animData[anim].height || targetSprite.height;
  targetSprite.frameWidth = targetSprite.animData[anim].width || targetSprite.width;

  if (targetSprite.currentAnim.name != anim) targetSprite.frame = 0;
  targetSprite.row = targetSprite.animData[anim].row;
  targetSprite.cols = targetSprite.animData[anim].cols;
  targetSprite.currentAnim.name = anim;
  targetSprite.playSpeed = targetSprite.animData[anim].playSpeed;

  if (playStyle === 'pingPong') {
    targetSprite.playStyle = 'pingPong';
    if (targetSprite.playDir == -1) targetSprite.playDir = 0;
  } else if (playStyle === 'once') {
    targetSprite.playStyle = 'once';
    targetSprite.playDir = 0;
  } else if (playStyle === 'onceReverse') {
    targetSprite.playStyle = 'onceReverse';
    targetSprite.playDir = 1;
    targetSprite.frame = targetSprite.cols - 1;
  } else if (playStyle === 'reverse') {
    targetSprite.playStyle = 'reverse';
    targetSprite.playDir = 1;
    targetSprite.frame = targetSprite.cols - 1;
  }

  targetSprite.currentAnim.onDone = onDone || emptyFunct;
};
var playAnim = function playAnim(ctx, targetSprite, freeze) {
  targetSprite.frameCount++;

  if (freeze) targetSprite.frame = 0;else if (targetSprite.playStyle == 'pingPong') {
    if (targetSprite.frameCount % targetSprite.playSpeed === 0) {

      if (targetSprite.playDir == 0) {
        if (targetSprite.frame < targetSprite.cols - 1) {
          targetSprite.frame++;
        } else {
          targetSprite.playDir = 1;
        }
      }
      if (targetSprite.playDir == 1) {
        if (targetSprite.frame > 0) {
          targetSprite.frame--;
        } else {
          targetSprite.playDir = 0;
          targetSprite.frame++;
        }
      }
    }
  } else if (targetSprite.playStyle == 'once' || targetSprite.playStyle == 'onceReverse') {
    if (targetSprite.frameCount % targetSprite.playSpeed === 0) {

      if (targetSprite.playDir == 0) {
        if (targetSprite.frame < targetSprite.cols - 1) {
          targetSprite.frame++;
        } else if (targetSprite.currentAnim.onDone != emptyFunct) {
          targetSprite.currentAnim.onDone();
          targetSprite.currentAnim.onDone = emptyFunct;
        }
      }
      if (targetSprite.playDir == 1) {
        if (targetSprite.frame > 0) {
          targetSprite.frame--;
        } else if (targetSprite.currentAnim.onDone != emptyFunct) {
          targetSprite.currentAnim.onDone();
          targetSprite.currentAnim.onDone = emptyFunct;
        }
      }
    }
  } else if (targetSprite.playStyle == 'reverse') {
    //switch frames after time
    if (targetSprite.frameCount % targetSprite.playSpeed === 0) {
      //move through animation and loop
      if (targetSprite.frame > 0) {
        targetSprite.frame--;
      } else {
        targetSprite.frame = targetSprite.cols - 1;
      }
    }
  } else {
    //switch frames after time
    if (targetSprite.frameCount % targetSprite.playSpeed === 0) {
      //move through animation and loop
      if (targetSprite.frame < targetSprite.cols - 1) {
        targetSprite.frame++;
      } else {
        targetSprite.frame = 0;
      }
    }
  }

  ctx.drawImage(targetSprite.sheet.img, targetSprite.frameWidth * targetSprite.frame, targetSprite.height * (targetSprite.row - 1), targetSprite.frameWidth, targetSprite.frameHeight, targetSprite.x, targetSprite.y, targetSprite.frameWidth, targetSprite.frameHeight);
};
//endregion

//--sound---------------------------region
var setupSound = function setupSound() {
  bgAudio = document.querySelector("#bgAudio");
  bgAudio.volume = 0.05;
  effectAudio = document.querySelector("#effectAudio");
  effectAudio.volume = 0.3;
  bgAudio.src = bgTracks.floralLife.src;
  bgAudio.current = bgTracks.floralLife;
};

var playBgAudio = function playBgAudio(reset) {
  if (reset) bgAudio.currentTime = 0;
  bgAudio.play();
};

var swapBg = function swapBg(track, reset) {
  bgTracks.current.lastTime = bgAudio.currentTime;
  bgTracks.current = bgTracks[track];
  bgAudio.src = bgTracks[track].src;

  bgAudio.currentTime = bgTracks.current.lastTime;
  if (reset) bgAudio.currentTime = bgTracks.current.lastTime = 0;
  bgAudio.play();
};

var stopBgAudio = function stopBgAudio(reset) {
  bgAudio.pause();
  if (reset) bgAudio.currentTime = 0;
};

var playEffect = function playEffect() {
  currentEffect = Math.round(Math.random() * 8) - 1;
  if (currentEffect < 0) currentEffect = 0;
  effectAudio.src = "assets/audio/" + effectSounds[currentEffect];
  //console.log(currentEffect);
  effectAudio.play();
};
//endregion
'use strict';

//--initial game setup-------------------region
var setupCanvas = function setupCanvas() {
  canvas = document.querySelector('#canvas_main');
  ctx = canvas.getContext('2d');
  canvas_overlay = document.querySelector('#canvas_overlay');
  ctx_overlay = canvas_overlay.getContext('2d');
  canvas_back = document.querySelector('#canvas_back');
  ctx_back = canvas_back.getContext('2d');

  width = canvas.width;
  height = canvas.height;
};
var setupSockets = function setupSockets() {
  socket = io.connect();

  //if this user joins
  socket.on("joined", function (data) {
    setUser(data);
  });

  //if other players join
  socket.on("otherJoined", function (data) {
    setOtherUser(data);
  });

  //if this user leaves
  socket.on("left", function (data) {
    removeUser(data);
  });

  //if other players leave
  socket.on("otherLeft", function (data) {
    removeOtherUser(data);
  });
};
//endregion

//--events-------------------------region
var setupEvents = function setupEvents() {
  document.onkeydown = keyDownHandler;
  document.onkeyup = keyUpHandler;

  //find the mouse position
  canvas_overlay.onmousemove = doOnMouseMove;
  //console.log('assigned startup game keys');
}; //events for gameplay

var assignStartupEvents = function assignStartupEvents() {
  if (gameState === STATES.title) {
    document.onkeyup = function () {
      removeStartupEvents();
      gameState = STATES.setupGame;
      console.log('setting up game');
    };
    canvas_overlay.onmousedown = function () {
      removeStartupEvents();
      gameState = STATES.setupGame;
      console.log('setting up game');
    };
  }
  //console.log('assigned pregame keys');
}; //event to start game
var removeStartupEvents = function removeStartupEvents() {
  //console.log('removed pregame keys');
  if (gameState === STATES.title) {
    document.onkeyup = undefined;
    canvas_overlay.onmousedown = undefined;
  }
}; //remove those events

//endregion
'use strict';

// when we receive character updates from the server
var update = function update(data) {};

var setUser = function setUser(data) {
  hash = data.hash; // set this client's hash to the unique hash the server gives them
  players[data.hash] = data.hash;
  playerCount += 1;

  console.log(data.name + ' [you] joined server');
  gameState = STATES.preload; // start animating;
};

var setOtherUser = function setOtherUser(data) {
  players[data.hash] = data;
  playerCount += 1;

  console.log(data.name + ' joined server');
};

var removeUser = function removeUser(data) {
  hash = 0; // set this client's hash to the unique hash the server gives them
  players = {};
  playerCount = 0;

  console.log(data.name + ' [you] left the server');
};

var removeOtherUser = function removeOtherUser(data) {
  delete players[data.hash];
  playerCount -= 1;

  console.log(data.name + ' left the server');
};

// update this client's position and send to server
var updatePosition = function updatePosition() {
  var plr = players[hash];

  //plr.alpha = 0.05;
  //plr.lastUpdate = new Date().getTime();
};

// move the sphere arround
var movement = function movement() {};

var resetGame = function resetGame() {
  //game setup
  playerCount = 0;
  players = {};

  up = false;
  left = false;
  right = false;
  down = false;
};

var startGame = function startGame() {
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

var doOnPreloadDone = function doOnPreloadDone() {
  console.log('done loading images');
  gameState = STATES.title;
  assignStartupEvents();

  cursor = new Sprite({ sheet: ANIMATIONS.cursor });
  setAnim(cursor, 'default', 'default');

  document.onmousemove = doOnMouseMove;
  document.onmousedown = doOnMouseDown;
  document.onmouseup = doOnMouseUp;
  document.onmouseout = doOnMouseOut;
};

var suspendPlayerControls = function suspendPlayerControls() {
  document.onkeydown = undefined;
  document.onkeyup = undefined;
};
var restorePlayerControls = function restorePlayerControls() {
  document.onkeydown = keyDownHandler;
  document.onkeyup = keyUpHandler;
};

//--GAME LOOPS---------------------region
var waitLoop = function waitLoop() {
  drawWait();
  console.log('waiting for connection to server...');
}; //wait until client joined the server

var preloadLoop = function preloadLoop() {
  //check if images are loaded then go to startup
  if (loadQueue == numLoaded) {
    doOnPreloadDone();
    return;
  }

  drawPreload();

  console.log('loading game...');
};

var titleLoop = function titleLoop() {
  drawTitle();
};

var gameOverLoop = function gameOverLoop() {
  drawGameOver();

  console.log('game over');
};

var gameUpdateLoop = function gameUpdateLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx_overlay.clearRect(0, 0, canvas_overlay.width, canvas_overlay.height);

  drawPlaceholder();

  //check player input

  //update game
  updatePosition();
  movement();

  //draw game
  drawPlayers();
};

//endregion
