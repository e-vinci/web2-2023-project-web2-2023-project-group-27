const WebSocket = require('ws');

const wsserver = new WebSocket.Server({ port: 8082 });
console.log('WebSocket Server is now running');

wsserver.on('connection', (ws) => {
  console.log('new client connected');

  ws.on('message', (data) => {
    // réception du message venant du client
    console.log(data.toString());
  });

  ws.on('close', () => {
    console.log('a client has disconnected');
  });
});
