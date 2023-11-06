const http = require('http').createServer();
const io = require('socket.io')(http, { cors: ['http://localhost:8082', 'https://e-baron.github.io'] });

io.on('connection', (socket) => {
  socket.emit('connected'); // Envoie d'une réponse disant qu'il est connecté au serveur

  socket.on('addPlayer', (nickname) => {
    console.log(nickname);
  });

  socket.on('disconnect', () => {
    // Le code quand un joueur se déconnecte
  });
});

// Ouverture du serveur sur le port 8082
http.listen(8082, () => console.log('WebSockets server listening on http://localhost:8082'));
