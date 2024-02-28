const { WebSocketServer } = require("ws");
const http = require("http");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const port = 1488;
const connections = {};

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString());
  console.log(message + " " + uuid);
  const connection = connections[uuid];
  connection.send(message);

  console.log(`Someone sent a message`);
};

const handleClose = (uuid) => {
  delete connections[uuid];
  //   broadcast();
};

wsServer.on("connection", (connection, request) => {
  const uuid = uuidv4();
  connections[uuid] = connection;
  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
