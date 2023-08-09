"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqsRouter_1 = __importDefault(require("./routers/sqsRouter"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(sqsRouter_1.default);
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ server });
exports.clients = new Set();
wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket server.");
    exports.clients.add(ws);
    ws.on("close", () => {
        console.log("Client disconnected from WebSocket server.");
        exports.clients.delete(ws);
    });
});
require("./utils/redis-handler");
exports.default = app;
