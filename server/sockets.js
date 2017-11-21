const xxh = require('xxhashjs');

// const Maps = require('./classes/Maps.js');

let io;

const users = { numUsers: 0 };

const setupSockets = (ioServer) => {
  io = ioServer;

  io.on('connection', (sock) => {
    const socket = sock;
    users.numUsers++;

    socket.join('lobby');

    // create an unique hash for each new client
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    socket.hash = hash;

    users[hash] = socket;
    users[hash].name = `user_${users.numUsers}`;
    console.log(`[${users[hash].name}] has joined`);

    socket.emit('joined', { name: users[hash].name, hash });
    socket.broadcast.to('lobby').emit('otherJoined', { name: users[hash].name, hash });

    socket.on('disconnect', () => {
      socket.emit('left', { name: users[socket.hash].name, hash });
      socket.broadcast.to('lobby').emit('otherLeft', { name: users[socket.hash].name, hash });

      console.log(`[${users[socket.hash].name}] has left`);
      delete users[socket.hash];

      socket.leave('lobby');
      users.numUsers--;
    });
  });
};

module.exports.setupSockets = setupSockets;
