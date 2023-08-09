"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = __importDefault(require(""));
// import express from "express";
// import cors from "cors";
// import sqsRouter from "./routers/sqsRouter";
// import http from "http";
// import WebSocket from "ws";
// const port = process.env.PORT;
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(sqsRouter);
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
// export const clients = new Set<WebSocket>();
// wss.on("connection", (ws) => {
//   console.log("Client connected to WebSocket server.");
//   clients.add(ws);
//   ws.on("close", () => {
//     console.log("Client disconnected from WebSocket server.");
//     clients.delete(ws);
//   });
// });
// import "./utils/redis-handler";
_1.default.listen(port, () => console.log("Server connected, port: ", port));
