const http = require('http').createServer();
const io = require('socket.io')(http, { cors: ['http://localhost:8082', 'https://e-baron.github.io'] });

// Websockets
io.on('connection', (socket) => {
  console.log('new connection');

  socket.emit('connected');

  socket.on('addPlayer', (nickname) => {
    console.log(nickname);
  });

  socket.on('disconnect', () => {
    console.log('a client has disconnected');
  });
});

http.listen(8082, () => console.log('WebSockets server listening on http://localhost:8082'));
