const handleSlime = (e) => {
  e.preventDefault();
  
  $('#slimeMessage').animate({width:'hide'},350);
  
  sendAjax('POST', $('#slimeForm').attr('action'), $('#slimeForm').serialize(), function() {
    loadSlimesFromServer();
  });
  
  return false;
};

const SlimeForm = (props) => {
  return (
    <form id='slimeForm'
      onSubmit={handleSlime}
      name='/slimeForm'
      action='/maker'
      method='POST'
      className='slimeForm'
      >
      <label htmlFor='name'>Name: </label>
      <input id='slimeName' type='text' name='name' placeholder='Slime Name' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input classsName='makeSlimeSubmit' type='submit' value='Make Slime' />
    </form>
  );
};

const SlimeList = function(props) {
  if(props.slimes.length === 0){
    return (
      <div className='cards'>
        <div className='cardHolder'>
            <div key={slime._id} className="card">
            <img src='assets/img/0.png' alt='slime' />
            <div className="card-over">no slimes yet! </div>
          </div>
        </div>
        <div className="side"></div>
    </div>
    );
  }

  const slimeNodes = props.slimes.map(function(slime){
    let num = 0;
    let nm = 'base';
    if(slime.id) num = slime.id;
    
    if(SLIMES[slime.name]) nm = slime.name;
    let img = `${num}.png`;
    img = '/assets/img/'+img;
    
    let fav = 'favorite_border';
    if(slime.fav) fav = 'favorite';
    
    let lvl = 0; if(slime.lvl) lvl = slime.lvl;
    
    return (
      //<div key={slime._id} className='slime'>
      //  <img src={img} alt='slime face' className='slimeView' />
      //  <h3 className='slimeName'>Nickname: {slime.name}</h3>
      //  <h3 className='slimeAge'>id: {slime.id}</h3>
      //</div>
      <div key={slime._id} className="card">
        <img src={img} alt={slime._id} />
        <div className="card-over">
          <i className="material-icons">{fav}</i>
          <b className="lvl">lvl: {lvl}</b>
        </div>
      </div>
    );
  });
  
  return (
    //<div className='slimeList'>
    <div className='cards'>
      <div className='cardHolder'>
      {slimeNodes}
      </div>
      <div className="side"></div>
    </div>
  );
};

const loadSlimesFromServer = () => {
  sendAjax('GET', '/getSlimes', null, (data) => {
    slimes = data.slimes;
    console.dir(slimes);
    ReactDOM.render(
      <SlimeList slimes={data.slimes} />, document.querySelector('#content')
    );
    initBox();
  });
};

const getSlimesFromServer = () => {
  sendAjax('GET', '/getSlimes', null, (data) => {
    slimes = data.slimes;
  });
};

const loadHome = () => {
  ReactDOM.render(
    <Home  />, document.querySelector('#content')
  );
}

const Home = () => {
return <div>
  <div className="slider">
    <input type="radio" name="ma-slider" id="s1" checked="true" />
    <div className="slide blue">[about]</div>
    
    <input type="radio" name="ma-slider" id="s2"/>
    <div className="slide green" >news 1</div>
    
    <input type="radio" name="ma-slider" id="s3" />
    <div className="slide purple">news 2</div>
    
    <input type="radio" name="ma-slider" id="s4"  />
    <div className="slide red">updates</div>
    
    <input type="radio" name="ma-slider" id="s5"  />
    <div className="slide orange">gachapons</div>
    
    <input type="radio" name="ma-slider" id="s6" />
    <div className="slide yellow">more info</div>
  </div>
  
  <div className="slider-controls">
    <label htmlFor="s1"></label>
    <label htmlFor="s2"></label>
    <label htmlFor="s3"></label>
    <label htmlFor="s4"></label>
    <label htmlFor="s5"></label>
    <label htmlFor="s6"></label>
  </div>
</div>
}

const loadShop = () => {
  ReactDOM.render(
    <Shop  />, document.querySelector('#content')
  );
}

const Shop = () => {
return <div>
  <div className="slider">
    <input type="radio" name="ma-slider" id="s1" checked="true" />
    <div className="slide blue">[machine 1]</div>
    
    <input type="radio" name="ma-slider" id="s2"/>
    <div className="slide green" >[machine 2]</div>
    
    <input type="radio" name="ma-slider" id="s3" />
    <div className="slide purple">[machine 3]</div>
    
    <input type="radio" name="ma-slider" id="s4"  />
    <div className="slide red">machine 4</div>

  </div>
  
  <div className="slider-controls">
    <label htmlFor="s1"></label>
    <label htmlFor="s2"></label>
    <label htmlFor="s3"></label>
    <label htmlFor="s4"></label>
  </div>
  
  <div className='shop-over'>
    <div id="shop-buy-coin" className="button"><span>[250]Buy!</span></div>
    <div id="shop-buy-gem" className="button"><span>[15]Buy!</span></div>
  </div>
</div>
}

const loadPlay = () => {
  ReactDOM.render(
    <Play  />, document.querySelector('#content')
  );
}

const Play = () => {
return <div>
  <div className="slider">
    <input type="radio" name="ma-slider" id="s1" checked="true" />
    <div className="slide blue">- Feature coming soon! -</div>
    
    <input type="radio" name="ma-slider" id="s2"/>
    <div className="slide green" >choose a team of 3 slimes,</div>
    
    <input type="radio" name="ma-slider" id="s3" />
    <div className="slide purple">face off against opponents,</div>
    
    <input type="radio" name="ma-slider" id="s4"  />
    <div className="slide red"> competitions to gain exp/loot! - </div>

  </div>
  
  <div className="slider-controls">
    <label htmlFor="s1"></label>
    <label htmlFor="s2"></label>
    <label htmlFor="s3"></label>
    <label htmlFor="s4"></label>
  </div>
</div>
}

//todo make a popup with detailed user info
const UserData = function(props) {
  if(!props.user.name){
    return;
  } else console.log(`username: ${props.user.name}`);
  const user = props.user;  
  
  return (
    <div className='user'>
      <div key={user._id} className='user'>
        <p className='userName'>Name: {user.name}</p>
        <p className='userLVL'>Lvl: {user.level}</p>
        <p className='userExp'>Exp: {user.exp}</p>
        <p className='userCoins'>Coins: {user.coins}</p>
      </div> 
    </div>
  );
};
const showUserData = () => {
  //ReactDOM.render(
  //  <UserData user={data.user} />, document.querySelector('#userPopup')
  //);
  
  document.querySelector('#user-coins').textContent = user.coins;
  document.querySelector('#user-gems').textContent = user.gems;
  document.querySelector('#user-name').textContent = user.name;
  
  
}

const getUserDataFromServer = () => {
  sendAjax('GET', '/getUser', null, (data) => {
    user = data.user;
    console.dir(user);
    showUserData();
  });
};

const setupMain = function(csrf) {
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

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupMain(result.csrfToken);
  });
};

const RenderSlimeList = () => {
  return <div className='cards'>
    <div className='cardHolder'>
      
    <div key={slime._id} className="card" value='base'>
      <img src='/assets/img/0.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#0</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='naruto'>
      <img src='/assets/img/1.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#1</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='navi'>
      <img src='/assets/img/2.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#2</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='devil'>
      <img src='/assets/img/8.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#3</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='saitama'>
      <img src='/assets/img/4.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#4</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='pikachu'>
      <img src='/assets/img/5.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#5</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='link'>
      <img src='/assets/img/6.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#6</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='angel'>
      <img src='/assets/img/7.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#7</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='death the kid'>
      <img src='/assets/img/3.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#8</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='shades'>
      <img src='/assets/img/9.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#9</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='maple slime'>
      <img src='/assets/img/10.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#10</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='bat'>
      <img src='/assets/img/11.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#11</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='wings'>
      <img src='/assets/img/12.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#12</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='mudkip'>
      <img src='/assets/img/13.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#13</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='derp'>
      <img src='/assets/img/14.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#14</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='totoro'>
      <img src='/assets/img/15.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#15</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='penguin'>
      <img src='/assets/img/16.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#16</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='goggles'>
      <img src='/assets/img/17.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#17</b>
      </div>
    </div>
      <div key={slime._id} className="card" value='rin okumura'>
      <img src='/assets/img/18.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#18</b>
      </div>
    </div>
    <div key={slime._id} className="card" value='liquid slime'>
      <img src='/assets/img/19.png' alt='slime' />
      <div className="card-over">
        <i className="material-icons fav-no">favorite</i>
        <b className="lvl">#19</b>
      </div>
    </div>
      < /div>
    <div className="side"></div>
  < /div>
};

const initBox = () => {
  var boxes = document.querySelectorAll('.card');
  var delay = .05; // seconds
  
  var last = boxes[0].offsetTop;
  var col = 0;
  var row = 0;
  
  var id = 0;
  var active = 'card_0';
  
  for (var i = 0; i < boxes.length; i++) {
    if(boxes[i].offsetTop > last) {
      row = row+1;
      col = 0;
    }
    var last = boxes[i].offsetTop;
    
    boxes[i].style.animationDelay = (row + col) * delay + 's'; 
    boxes[i].id = 'card_'+id;
    boxes[i].onclick = function(){ 
      
      document.querySelector(`#${active}`).classList.remove('card-selected');
      active = this.id;
      document.querySelector(`#${active}`).classList.add('card-selected');
      
      let card = document.querySelector(`#${active}`);
      let idNum = card.id.split('card_')[1];
      
      let side = document.querySelector('.side');
      
      let img = side.querySelector('img');
      img.src = card.querySelector('img').src;
      
      let nm = document.querySelector('#side-name');
      nm.textContent = '#'+slimes[idNum].id+ " " + slimes[idNum].name;
      
      let num = document.querySelector('#side-lvl');
      num.textContent = card.querySelector('.lvl').textContent;
      
    }.bind(boxes[i]);  
    col = col+1;
    id++;
  };
  
  let card = document.querySelector(`#${active}`);
  let idNum = card.id.split('card_')[1];
  let side = document.querySelector('.side');
  side.innerHTML = '';
      
  let nm = document.createElement('h3');
  nm.id = 'side-name';
  
  if(slimes[idNum]) {
    nm.textContent = '#' + slimes[idNum].id + " " + slimes[idNum].name;
  }
  else nm.textContent = '#??? Slime';

  let img = document.createElement('img');
  img.src = card.querySelector('img').src;
  
  let lvl = document.createElement('h3');
  lvl.id = 'side-lvl';
      
  if(slimes[idNum])lvl.textContent = slimes[idNum].lvl;
  else lvl.textContent = 'lvl: 1';

  side.appendChild(nm);
  side.appendChild(img);
  side.appendChild(lvl);
};
    

window.onload = () => {
  getToken();
  setupSockets();
  initBox();
  init();
  
  let menu_selected = 'home';
      
  ReactDOM.render(
      <SlimeForm />, document.querySelector('#makeSlime')
    );
      
  document.querySelector('#slimeListButton').onclick = () => {
    ReactDOM.render(
      <RenderSlimeList />, document.querySelector('#content')
    );
    initBox();
  }
  document.querySelector('#menu-home').onclick = () => {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadHome();
    
    document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    menu_selected = 'home';
    document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
  }
  document.querySelector('#menu-shop').onclick = () => {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadShop();
    
    document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    menu_selected = 'shop';
    document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
  }
  document.querySelector('#menu-play').onclick = () => {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    loadPlay();
    
    document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    menu_selected = 'play';
    document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
  }
  document.querySelector('#menu-slimes').onclick = () => {
    ReactDOM.render(
      <SlimeList slimes={[]} />, document.querySelector('#content')
    );
  
    loadSlimesFromServer();
    initBox();
    
    document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    menu_selected = 'slimes';
    document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
  }
  document.querySelector('#menu-misc').onclick = () => {
    //ReactDOM.render(
    //  <SlimeList slimes={[]} />, document.querySelector('#content')
    //);
    
    
    //document.querySelector(`#menu-${menu_selected}`).classList.remove('menu-selected');
    //document.querySelector(`#menu-${menu_selected}`).classList.add('menu-selected');
    //menu_selected = 'misc';
  }
  
  document.querySelector('#aboutButton').onclick = () => {
    ReactDOM.render(
      <RenderAbout />, document.querySelector('#content')
    );
    console.log('...')
  }
  document.querySelector('#docButton').onclick = () => {
    ReactDOM.render(
      <RenderDoc />, document.querySelector('#content')
    );
  }
  
};