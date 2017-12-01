const handleSlime = (e) => {
  e.preventDefault();
  
  $('#slimeMessage').animate({width:'hide'},350);
  
  if($('#slimeName').val() == ''){
    handleError("RAWR! All fields are required.");
    return false;
  }
  
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
      <div className='slimeList'>
        <h3 className='emptySlime'>No Slimes yet</h3>
      </div>
    );
  }

  const slimeNodes = props.slimes.map(function(slime){
    let num = 0
    if(slime.id) num = slime.id;
    let img = `${num}.png`;
    img = '/assets/img/'+img;
    return (
      <div key={slime._id} className='slime'>
        <img src={img} alt='slime face' className='slimeFace' />
        <h3 className='slimeName'>Nickname: {slime.name}</h3>
        <h3 className='slimeAge'>id: {slime.id}</h3>
      </div>
    );
  });
  
  return (
    <div className='slimeList'>
      {slimeNodes}
    </div>
  );
};

const loadSlimesFromServer = () => {
  sendAjax('GET', '/getSlimes', null, (data) => {
    ReactDOM.render(
      <SlimeList slimes={data.slimes} />, document.querySelector('#slimes')
    );
  });
};

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
  ReactDOM.render(
    <UserData user={data.user} />, document.querySelector('#userPopup')
  );
}


const getUserDataFromServer = () => {
  sendAjax('GET', '/getUser', null, (data) => {
    //console.dir(data.user);
    user = data.user;
  });
};

const setupMain = function(csrf) {
  ReactDOM.render(
    <SlimeForm csrf={csrf} />, document.querySelector('#makeSlime')
  );
  
  ReactDOM.render(
    <SlimeList slimes={[]} />, document.querySelector('#slimes')
  );
  
  loadSlimesFromServer();
  getUserDataFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupMain(result.csrfToken);
  });
};

const RenderSlimeList = () => {
  return <div className='slimeList'>
    <h2 style={{display: 'inline-block'}} >Slime Dex:</h2>  <div style={{display: 'inline', float: 'right'}}  id="showSlimes" className="navlink"><a>Show Your Slimes< /a>< /div>

    <div key={slime._id} className='slime'>
      <img src='/assets/img/0.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: base</h3>
      <h3 className='slimeAge'>id: 0</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/1.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Naruto</h3>
      <h3 className='slimeAge'>id: 1</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/2.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Navi</h3>
      <h3 className='slimeAge'>id: 2</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/3.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Death the Kid</h3>
      <h3 className='slimeAge'>id: 3</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/4.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Saitama</h3>
      <h3 className='slimeAge'>id: 4</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/5.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Pikachu</h3>
      <h3 className='slimeAge'>id: 5</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/6.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Link</h3>
      <h3 className='slimeAge'>id: 6</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/7.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Angel</h3>
      <h3 className='slimeAge'>id: 7</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/8.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Devil</h3>
      <h3 className='slimeAge'>id: 8</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/9.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Shades</h3>
      <h3 className='slimeAge'>id: 9</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/10.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Maple Slime</h3>
      <h3 className='slimeAge'>id: 10</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/11.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Bat</h3>
      <h3 className='slimeAge'>id: 11</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/12.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Wings</h3>
      <h3 className='slimeAge'>id: 12</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/13.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Mudkip</h3>
      <h3 className='slimeAge'>id: 13</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/14.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Derp</h3>
      <h3 className='slimeAge'>id: 14</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/15.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Totoro</h3>
      <h3 className='slimeAge'>id: 15</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/16.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Penguin</h3>
      <h3 className='slimeAge'>id: 16</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/17.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Goggles</h3>
      <h3 className='slimeAge'>id: 17</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/18.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Rin Okumura</h3>
      <h3 className='slimeAge'>id: 18</h3>
    </div>
    <div key={slime._id} className='slime'>
      <img src='/assets/img/19.png' alt='slime face' className='slimeFace' />
      <h3 className='slimeName'>Name: Liquid Slime</h3>
      <h3 className='slimeAge'>id: 19</h3>
    </div>
  
  </div>
}

$(document).ready(function(){
  getToken();
  init();
  
  document.querySelector('#slimeListButton').onclick = () => {
    ReactDOM.render(
      <RenderSlimeList />, document.querySelector('#slimes')
    );
    document.querySelector('#showSlimes').onclick = () => {
    loadSlimesFromServer();
  };
  }
  document.querySelector('#aboutButton').onclick = () => {
    ReactDOM.render(
      <RenderAbout />, document.querySelector('#slimes')
    );
  }
  document.querySelector('#docButton').onclick = () => {
    ReactDOM.render(
      <RenderDoc />, document.querySelector('#slimes')
    );
  }
  
});