'use strict';

//--general---------------------------region
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
//endregion

//--collision-------------------------region
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
//endregion

//--draw/text-------------------------region
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
//endregion
"use strict";

var mouse = { x: 0, y: 0 };

var paused = false,
    debug = true;

var user = {};
var players = {};
var playerCount = 0;

var gacha = undefined,
    capsule = undefined;
var slimes = {};

//handle for key down events
var keyDownHandler = function keyDownHandler(e) {
  var keyPressed = e.which;

  // W OR UP
  if (keyPressed === 38) {
    //console.log('up key');
    e.preventDefault();
  }
  // A OR LEFT
  else if (keyPressed === 37) {
      //console.log('left key');
      e.preventDefault();
    }
    // S OR DOWN
    else if (keyPressed === 40) {
        //console.log('down key');
        e.preventDefault();
      }
      // D OR RIGHT
      else if (keyPressed === 39) {
          //console.log('right key');
          e.preventDefault();
        }
};

var init = function init() {
  //setupCanvas(); 
  setupSockets();

  window.onkeydown = keyDownHandler;
};

var toggleDebug = function toggleDebug() {
  if (debug) {
    debug = false;
    return;
  }
  debug = true;
};

//ONBLUR
window.onblur = function () {}
//pauseGame();
//console.log('blur');

//ONFOCUS
;window.onfocus = function () {
  //resumeGame();
  //console.log('focus');
};
'use strict';

var handleSlime = function handleSlime(e) {
  e.preventDefault();

  $('#slimeMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', $('#slimeForm').attr('action'), $('#slimeForm').serialize(), function () {
    loadSlimesFromServer();
  });

  return false;
};

var SlimeForm = function SlimeForm(props) {
  return React.createElement(
    'form',
    { id: 'slimeForm',
      onSubmit: handleSlime,
      name: '/slimeForm',
      action: '/maker',
      method: 'POST',
      className: 'slimeForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'slimeName', type: 'text', name: 'name', placeholder: 'Slime Name' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { classsName: 'makeSlimeSubmit', type: 'submit', value: 'Make Slime' })
  );
};

var SlimeList = function SlimeList(props) {
  if (props.slimes.length === 0) {
    return React.createElement(
      'div',
      { className: 'cards' },
      React.createElement(
        'div',
        { className: 'cardHolder' },
        React.createElement(
          'div',
          { key: slime._id, className: 'card' },
          React.createElement('img', { src: 'assets/img/0.png', alt: 'slime' }),
          React.createElement(
            'div',
            { className: 'card-over' },
            'no slimes yet! '
          )
        )
      ),
      React.createElement('div', { className: 'side' })
    );
  }

  var slimeNodes = props.slimes.map(function (slime) {
    var num = 0;
    var nm = 'base';
    if (slime.id) num = slime.id;

    if (SLIMES[slime.name]) nm = slime.name;
    var img = num + '.png';
    img = '/assets/img/' + img;

    var fav = 'favorite_border';
    if (slime.fav) fav = 'favorite';

    var lvl = 0;if (slime.lvl) lvl = slime.lvl;

    return (
      //<div key={slime._id} className='slime'>
      //  <img src={img} alt='slime face' className='slimeView' />
      //  <h3 className='slimeName'>Nickname: {slime.name}</h3>
      //  <h3 className='slimeAge'>id: {slime.id}</h3>
      //</div>
      React.createElement(
        'div',
        { key: slime._id, className: 'card' },
        React.createElement('img', { src: img, alt: slime._id }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons' },
            fav
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            'lvl: ',
            lvl
          )
        )
      )
    );
  });

  return (
    //<div className='slimeList'>
    React.createElement(
      'div',
      { className: 'cards' },
      React.createElement(
        'div',
        { className: 'cardHolder' },
        slimeNodes
      ),
      React.createElement('div', { className: 'side' })
    )
  );
};

var loadSlimesFromServer = function loadSlimesFromServer() {
  sendAjax('GET', '/getSlimes', null, function (data) {
    slimes = data.slimes;
    console.dir(slimes);
    ReactDOM.render(React.createElement(SlimeList, { slimes: data.slimes }), document.querySelector('#content'));
    initBox();
  });
};

var getSlimesFromServer = function getSlimesFromServer() {
  sendAjax('GET', '/getSlimes', null, function (data) {
    slimes = data.slimes;
  });
};

var loadHome = function loadHome() {
  ReactDOM.render(React.createElement(Home, null), document.querySelector('#content'));
};

var Home = function Home() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'slider' },
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's1', checked: 'true' }),
      React.createElement(
        'div',
        { className: 'slide blue' },
        '[about]'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's2' }),
      React.createElement(
        'div',
        { className: 'slide green' },
        'news 1'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's3' }),
      React.createElement(
        'div',
        { className: 'slide purple' },
        'news 2'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's4' }),
      React.createElement(
        'div',
        { className: 'slide red' },
        'updates'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's5' }),
      React.createElement(
        'div',
        { className: 'slide orange' },
        'gachapons'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's6' }),
      React.createElement(
        'div',
        { className: 'slide yellow' },
        'more info'
      )
    ),
    React.createElement(
      'div',
      { className: 'slider-controls' },
      React.createElement('label', { htmlFor: 's1' }),
      React.createElement('label', { htmlFor: 's2' }),
      React.createElement('label', { htmlFor: 's3' }),
      React.createElement('label', { htmlFor: 's4' }),
      React.createElement('label', { htmlFor: 's5' }),
      React.createElement('label', { htmlFor: 's6' })
    )
  );
};

var loadShop = function loadShop() {
  ReactDOM.render(React.createElement(Shop, null), document.querySelector('#content'));
};

var Shop = function Shop() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'slider' },
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's1', checked: 'true' }),
      React.createElement(
        'div',
        { className: 'slide blue' },
        '[machine 1]'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's2' }),
      React.createElement(
        'div',
        { className: 'slide green' },
        '[machine 2]'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's3' }),
      React.createElement(
        'div',
        { className: 'slide purple' },
        '[machine 3]'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's4' }),
      React.createElement(
        'div',
        { className: 'slide red' },
        'machine 4'
      )
    ),
    React.createElement(
      'div',
      { className: 'slider-controls' },
      React.createElement('label', { htmlFor: 's1' }),
      React.createElement('label', { htmlFor: 's2' }),
      React.createElement('label', { htmlFor: 's3' }),
      React.createElement('label', { htmlFor: 's4' })
    ),
    React.createElement(
      'div',
      { className: 'shop-over' },
      React.createElement(
        'div',
        { id: 'shop-buy-coin', className: 'button' },
        React.createElement(
          'span',
          null,
          '[250]Buy!'
        )
      ),
      React.createElement(
        'div',
        { id: 'shop-buy-gem', className: 'button' },
        React.createElement(
          'span',
          null,
          '[15]Buy!'
        )
      )
    )
  );
};

var loadPlay = function loadPlay() {
  ReactDOM.render(React.createElement(Play, null), document.querySelector('#content'));
};

var Play = function Play() {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'div',
      { className: 'slider' },
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's1', checked: 'true' }),
      React.createElement(
        'div',
        { className: 'slide blue' },
        '- Feature coming soon! -'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's2' }),
      React.createElement(
        'div',
        { className: 'slide green' },
        'choose a team of 3 slimes,'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's3' }),
      React.createElement(
        'div',
        { className: 'slide purple' },
        'face off against opponents,'
      ),
      React.createElement('input', { type: 'radio', name: 'ma-slider', id: 's4' }),
      React.createElement(
        'div',
        { className: 'slide red' },
        ' competitions to gain exp/loot! - '
      )
    ),
    React.createElement(
      'div',
      { className: 'slider-controls' },
      React.createElement('label', { htmlFor: 's1' }),
      React.createElement('label', { htmlFor: 's2' }),
      React.createElement('label', { htmlFor: 's3' }),
      React.createElement('label', { htmlFor: 's4' })
    )
  );
};

//todo make a popup with detailed user info
var UserData = function UserData(props) {
  if (!props.user.name) {
    return;
  } else console.log('username: ' + props.user.name);
  var user = props.user;

  return React.createElement(
    'div',
    { className: 'user' },
    React.createElement(
      'div',
      { key: user._id, className: 'user' },
      React.createElement(
        'p',
        { className: 'userName' },
        'Name: ',
        user.name
      ),
      React.createElement(
        'p',
        { className: 'userLVL' },
        'Lvl: ',
        user.level
      ),
      React.createElement(
        'p',
        { className: 'userExp' },
        'Exp: ',
        user.exp
      ),
      React.createElement(
        'p',
        { className: 'userCoins' },
        'Coins: ',
        user.coins
      )
    )
  );
};
var showUserData = function showUserData() {
  //ReactDOM.render(
  //  <UserData user={data.user} />, document.querySelector('#userPopup')
  //);

  document.querySelector('#user-coins').textContent = user.coins;
  document.querySelector('#user-gems').textContent = user.gems;
  document.querySelector('#user-name').textContent = user.name;
};

var getUserDataFromServer = function getUserDataFromServer() {
  sendAjax('GET', '/getUser', null, function (data) {
    user = data.user;
    console.dir(user);
    showUserData();
  });
};

var setupMain = function setupMain(csrf) {
  //ReactDOM.render(
  //  <SlimeForm csrf={csrf} />, document.querySelector('#makeSlime')
  //);
  //
  //ReactDOM.render(
  //  <SlimeList slimes={[]} />, document.querySelector('#content')
  //);

  getSlimesFromServer();
  getUserDataFromServer();

  loadHome();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setupMain(result.csrfToken);
  });
};

var RenderSlimeList = function RenderSlimeList() {
  return React.createElement(
    'div',
    { className: 'cards' },
    React.createElement(
      'div',
      { className: 'cardHolder' },
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'base' },
        React.createElement('img', { src: '/assets/img/0.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#0'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'naruto' },
        React.createElement('img', { src: '/assets/img/1.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#1'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'navi' },
        React.createElement('img', { src: '/assets/img/2.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#2'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'devil' },
        React.createElement('img', { src: '/assets/img/8.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#3'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'saitama' },
        React.createElement('img', { src: '/assets/img/4.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#4'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'pikachu' },
        React.createElement('img', { src: '/assets/img/5.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#5'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'link' },
        React.createElement('img', { src: '/assets/img/6.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#6'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'angel' },
        React.createElement('img', { src: '/assets/img/7.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#7'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'death the kid' },
        React.createElement('img', { src: '/assets/img/3.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#8'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'shades' },
        React.createElement('img', { src: '/assets/img/9.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#9'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'maple slime' },
        React.createElement('img', { src: '/assets/img/10.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#10'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'bat' },
        React.createElement('img', { src: '/assets/img/11.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#11'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'wings' },
        React.createElement('img', { src: '/assets/img/12.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#12'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'mudkip' },
        React.createElement('img', { src: '/assets/img/13.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#13'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'derp' },
        React.createElement('img', { src: '/assets/img/14.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#14'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'totoro' },
        React.createElement('img', { src: '/assets/img/15.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#15'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'penguin' },
        React.createElement('img', { src: '/assets/img/16.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#16'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'goggles' },
        React.createElement('img', { src: '/assets/img/17.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#17'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'rin okumura' },
        React.createElement('img', { src: '/assets/img/18.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#18'
          )
        )
      ),
      React.createElement(
        'div',
        { key: slime._id, className: 'card', value: 'liquid slime' },
        React.createElement('img', { src: '/assets/img/19.png', alt: 'slime' }),
        React.createElement(
          'div',
          { className: 'card-over' },
          React.createElement(
            'i',
            { className: 'material-icons fav-no' },
            'favorite'
          ),
          React.createElement(
            'b',
            { className: 'lvl' },
            '#19'
          )
        )
      )
    ),
    React.createElement('div', { className: 'side' })
  );
};

var initBox = function initBox() {
  var boxes = document.querySelectorAll('.card');
  var delay = .05; // seconds

  var last = boxes[0].offsetTop;
  var col = 0;
  var row = 0;

  var id = 0;
  var active = 'card_0';

  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].offsetTop > last) {
      row = row + 1;
      col = 0;
    }
    var last = boxes[i].offsetTop;

    boxes[i].style.animationDelay = (row + col) * delay + 's';
    boxes[i].id = 'card_' + id;
    boxes[i].onclick = function () {

      document.querySelector('#' + active).classList.remove('card-selected');
      active = this.id;
      document.querySelector('#' + active).classList.add('card-selected');

      var card = document.querySelector('#' + active);
      var idNum = card.id.split('card_')[1];

      var side = document.querySelector('.side');

      var img = side.querySelector('img');
      img.src = card.querySelector('img').src;

      var nm = document.querySelector('#side-name');
      nm.textContent = '#' + slimes[idNum].id + " " + slimes[idNum].name;

      var num = document.querySelector('#side-lvl');
      num.textContent = card.querySelector('.lvl').textContent;
    }.bind(boxes[i]);
    col = col + 1;
    id++;
  };

  var card = document.querySelector('#' + active);
  var idNum = card.id.split('card_')[1];
  var side = document.querySelector('.side');
  side.innerHTML = '';

  var nm = document.createElement('h3');
  nm.id = 'side-name';

  if (slimes[idNum]) {
    nm.textContent = '#' + slimes[idNum].id + " " + slimes[idNum].name;
  } else nm.textContent = '#??? Slime';

  var img = document.createElement('img');
  img.src = card.querySelector('img').src;

  var lvl = document.createElement('h3');
  lvl.id = 'side-lvl';

  if (slimes[idNum]) lvl.textContent = slimes[idNum].lvl;else lvl.textContent = 'lvl: 1';

  side.appendChild(nm);
  side.appendChild(img);
  side.appendChild(lvl);
};

window.onload = function () {
  getToken();
  setupSockets();
  initBox();
  init();

  var menu_selected = 'home';

  ReactDOM.render(React.createElement(SlimeForm, null), document.querySelector('#makeSlime'));

  document.querySelector('#slimeListButton').onclick = function () {
    ReactDOM.render(React.createElement(RenderSlimeList, null), document.querySelector('#content'));
    initBox();
  };
  document.querySelector('#menu-home').onclick = function () {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadHome();

    document.querySelector('#menu-' + menu_selected).classList.remove('menu-selected');
    menu_selected = 'home';
    document.querySelector('#menu-' + menu_selected).classList.add('menu-selected');
  };
  document.querySelector('#menu-shop').onclick = function () {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadShop();

    document.querySelector('#menu-' + menu_selected).classList.remove('menu-selected');
    menu_selected = 'shop';
    document.querySelector('#menu-' + menu_selected).classList.add('menu-selected');
  };
  document.querySelector('#menu-play').onclick = function () {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadPlay();

    document.querySelector('#menu-' + menu_selected).classList.remove('menu-selected');
    menu_selected = 'play';
    document.querySelector('#menu-' + menu_selected).classList.add('menu-selected');
  };
  document.querySelector('#menu-slimes').onclick = function () {
    ReactDOM.render(React.createElement(SlimeList, { slimes: [] }), document.querySelector('#content'));

    loadSlimesFromServer();
    initBox();

    document.querySelector('#menu-' + menu_selected).classList.remove('menu-selected');
    menu_selected = 'slimes';
    document.querySelector('#menu-' + menu_selected).classList.add('menu-selected');
  };
  document.querySelector('#menu-misc').onclick = function () {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);


    //document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    //document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
    //menu_selected = 'misc';
  };

  document.querySelector('#aboutButton').onclick = function () {
    ReactDOM.render(React.createElement(RenderAbout, null), document.querySelector('#content'));
    console.log('...');
  };
  document.querySelector('#docButton').onclick = function () {
    ReactDOM.render(React.createElement(RenderDoc, null), document.querySelector('#content'));
  };
};
"use strict";

var socket = void 0,
    hash = void 0,
    username = void 0;

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

var setUser = function setUser(data) {
  hash = data.hash;

  console.log(data.name + ' [you] joined server');
};

var setOtherUser = function setOtherUser(data) {

  console.log(data.name + ' joined server');
};

var removeUser = function removeUser(data) {
  hash = 0;

  console.log(data.name + ' [you] left the server');
};

var removeOtherUser = function removeOtherUser(data) {

  console.log(data.name + ' left the server');
};
'use strict';

var SLIMES = {
  base: {
    name: 'base',
    id: 0,
    type: '',
    stats: {
      atk: 0,
      spd: 0
    },
    skills: []
  },

  naruto: {
    name: 'naruto',
    id: 1
  }
};

var STATUS = {
  stun: {
    name: 'stun',
    turns: 1,
    buff: [],
    debuff: []
  }
};

var TYPES = {
  normal: {
    name: 'normal',
    weakTo: [],
    resistTo: []
  },
  fire: {
    name: 'fire',
    weakTo: ['water'],
    resistTo: ['grass']
  },
  water: {
    name: 'water',
    weakTo: ['grass'],
    resistTo: ['fire']
  },
  grass: {
    name: 'grass',
    weakTo: ['fire'],
    resistTo: ['water']
  },
  dark: {
    name: 'dark',
    weakTo: ['light'],
    resistTo: ['water']
  },
  light: {
    name: 'light',
    weakTo: ['dark'],
    resistTo: ['fire']
  }
};

var SKILLS = {
  whack: {
    name: 'whack',
    type: TYPES.normal,
    dmg: 10,
    heal: 0,
    status: 0,
    buff: 0,
    debuff: 0
  }
};
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#slimeMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#slimeMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
