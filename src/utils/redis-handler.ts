import { clients } from "../index";
import redisClient from "../db/redisdb";
import WebSocket = require("ws");

redisClient.subscribe("crawler-jobs");

redisClient.on("message", (channel, message) => {
  console.log("Received message from Redis channel:", channel);

  clients.forEach((client) => {
    
    
    if (client.readyState === WebSocket.OPEN) {
      console.log(message);

      client.send(message);
    }
  });
});
