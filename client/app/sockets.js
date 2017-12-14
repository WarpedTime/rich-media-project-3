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
  hash = data.hash;

  console.log( data.name + ' [you] joined server');
};

const setOtherUser = (data) => {

  
  console.log( data.name + ' joined server');
};

const removeUser = (data) => {
  hash = 0; 

  console.log( data.name + ' [you] left the server');
};

const removeOtherUser = (data) => {

  
  console.log( data.name + ' left the server');
};