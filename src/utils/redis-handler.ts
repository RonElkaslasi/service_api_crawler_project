import { clients } from "..";
import redisClient from "../db/redisdb";

redisClient.subscribe("crawler-jobs");

redisClient.on("message", (channel, message) => {
  console.log("Received message from Redis channel:", channel);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});
