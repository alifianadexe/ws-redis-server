

require('dotenv').config();

const express = require('express');
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const app = express();
// const https = require('https');
// const fs = require('fs');
// const server = https.createServer({
//         key: fs.readFileSync(process.env.SOCKET_KEY),
//         cert: fs.readFileSync(process.env.SOCKET_CERT)
// }, app);

const http = require('http');
const fs = require('fs');
const server = http.createServer({}, app);

const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_URL,
      credentials: true
    }
});

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  io.listen(process.env.SOCKET_PORT);
});