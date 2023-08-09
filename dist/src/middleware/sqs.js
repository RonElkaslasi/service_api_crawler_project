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
exports.pollMessagesFromQueue = exports.sendMessageToQueue = exports.createQueue = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const sqs = new aws_sdk_1.default.SQS({
    apiVersion: "2012-11-05",
    region: process.env.AWS_REGION,
});
const createQueue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const QueueName = req.body.queueName;
    try {
        const data = yield sqs.createQueue({ QueueName }).promise();
        res.locals.queueUrl = data.QueueUrl;
        next();
    }
    catch (err) {
        console.log(err);
    }
});
exports.createQueue = createQueue;
const sendMessageToQueue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const QueueUrl = req.body.queueUrl;
    const MessageBodyObject = req.body.messageBody;
    const title = req.body.title;
    const MessageBody = JSON.stringify(MessageBodyObject);
    try {
        const MessageId = yield sqs
            .sendMessage({
            QueueUrl: process.env.QUEUE_URL || "",
            MessageAttributes: {
                title: {
                    DataType: "String",
                    StringValue: title,
                },
            },
            MessageBody,
        })
            .promise();
        res.locals.messageId = MessageId.MessageId;
        next();
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendMessageToQueue = sendMessageToQueue;
const pollMessagesFromQueue = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const QueueUrl = req.query.queueUrl;
    try {
        const messages = yield sqs
            .receiveMessage({
            QueueUrl,
            MaxNumberOfMessages: 10,
            MessageAttributeNames: ["All"],
            VisibilityTimeout: 30,
            WaitTimeSeconds: 10,
        })
            .promise();
        res.locals.messages = messages.Messages;
        next();
        if (res.locals.messages.length !== 0) {
            const messagesDeletionFuncs = res.locals.messages.map((message) => {
                return sqs.deleteMessage({
                    QueueUrl,
                    ReceiptHandle: message.ReceiptHandle,
                });
            });
            Promise.allSettled(messagesDeletionFuncs).then((data) => console.log(data));
        }
    }
    catch (err) {
        console.log(err);
    }
});
exports.pollMessagesFromQueue = pollMessagesFromQueue;
