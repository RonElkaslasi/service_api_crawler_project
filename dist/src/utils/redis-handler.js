"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const redisdb_1 = __importDefault(require("../db/redisdb"));
redisdb_1.default.subscribe("crawler-jobs");
redisdb_1.default.on("message", (channel, message) => {
    console.log("Received message from Redis channel:", channel);
    index_1.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
});
