"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqs_1 = require("../middleware/sqs");
const router = express_1.default.Router();
router.post("/create-queue", sqs_1.createQueue, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ queueUrl: res.locals.queueUrl });
}));
router.post("/scrape-jobs", sqs_1.sendMessageToQueue, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send({ messageId: res.locals.messageId });
}));
exports.default = router;
