let socket, hash, username;

const setupSockets = () => {
  socket = io.connect();
  
  //if this user joins
  socket.on("joined",(data) => {
     setUser(data);
  });

  //if other players join
  socket.on("otherJoined",(data) => {
     setOtherUser(data); 
  });
  
  //if this user leaves
  socket.on("left",(data) => {
     removeUser(data);
  });

  //if other players leave
  socket.on("otherLeft",(data) => {
     removeOtherUser(data); 
  });
};

const setUser = (data) => {
  hash = data.hash; // set this client's hash to the unique hash the server gives them
  //players[data.hash] = data.hash;
  //playerCount += 1;

  console.log( data.name + ' [you] joined server');
  gameState = STATES.preload // start animating;
};

const setOtherUser = (data) => {
  //players[data.hash] = data;
  //playerCount += 1;
  
  console.log( data.name + ' joined server');
};

const removeUser = (data) => {
  hash = 0; // set this client's hash to the unique hash the server gives them
  //players = { };
  //playerCount = 0;

  console.log( data.name + ' [you] left the server');
};

const removeOtherUser = (data) => {
  //delete players[data.hash];
  //playerCount -= 1;
  
  console.log( data.name + ' left the server');
};