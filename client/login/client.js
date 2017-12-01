const handleLogin = (e) => {
  e.preventDefault();
  $('#slimeMessage').animate({width:'hide'},350);
  
  if($('#user').val() == '' || $('#pass').val() == ''){
    handleError('RAWR! Username or password is empty.');
    return false;
  }
  
  console.log($('input[name=_csrf]').val());
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  
  $('#slimeMessage').animate({width:'hide'}, 350);
  
  if($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == ''){
    handleError('RAWR! All fields are required.');
    return false;
  }
  
  if($('#pass').val() !== $('#pass2').val()){
    handleError('RAWR! Passowrds do not match.');
    return false;
  }
  
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  
  return false;
};

const LoginWindow = (props) => {
  return (
    <form id='loginForm' name = 'loginForm'
      onSubmit={handleLogin}
      action='/login'
      method='POST'
      className='mainForm'
      >
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username' />
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign in' />
      
    </form> 
  );
};

const SignupWindow = (props) => {
  return (
    <form id='signupForm'
      name = 'signupForm'
      onSubmit={handleSignup}
      action='/signup'
      method='POST'
      className='mainForm'
      >
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username' />
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password' /><label htmlFor='pass2'>Password: </label>
      <input id='pass2' type='password' name='pass2' placeholder='retype password' />
      <input type='hidden' name='_csrf' value={props.csrf} />
      <input className='formSubmit' type='submit' value='Sign Up' />
      
    </form> 
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

const setupLogin = (csrf) => {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');
  
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  createLoginWindow(csrf);
};  

//todo vv replace with react element in p3
const showLoginBox = () => {
  /*
  document.querySelector('#test-login').classList.remove('hidden');
  document.querySelector('#login-submit').onclick = submitLogin;
  
  document.querySelector('#signup-tab').onclick = () => {
    document.querySelector('#login').classList.add('hidden');
    document.querySelector('#signup').classList.remove('hidden');
    
    document.querySelector('#signup-tab').classList.remove('inactive');
    document.querySelector('#login-tab').classList.add('inactive');
  };
  document.querySelector('#login-tab').onclick = () => {
    document.querySelector('#login').classList.remove('hidden');
    document.querySelector('#signup').classList.add('hidden');
    
    document.querySelector('#signup-tab').classList.add('inactive');
    document.querySelector('#login-tab').classList.remove('inactive');
  };
  suspendPlayerControls();
  removeStartupEvents();
  */
};
const hideLoginBox = () => {
  //document.querySelector('#test-login').classList.add('hidden');
  //restorePlayerControls();
  //assignStartupEvents();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setupLogin(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});