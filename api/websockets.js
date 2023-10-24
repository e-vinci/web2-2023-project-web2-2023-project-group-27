const WebSocket = require('ws');

const wsserver = new WebSocket.Server({ port: 8082 });

wsserver.on('connection', (ws) => {
  console.log('new client connected');

  ws.on('message', (data) => {
    // TODO CORRIGER LE BUFFER
    console.log(data.toString());
  });

  ws.on('close', () => {
    console.log('a client has disconnected');
  });
});
