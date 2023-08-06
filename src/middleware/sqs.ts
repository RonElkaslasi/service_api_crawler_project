import AWS from "aws-sdk";
import { Request, Response, NextFunction } from "express";

const sqs = new AWS.SQS({
  apiVersion: "2012-11-05",
  region: process.env.AWS_REGION,
});

export const createQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const QueueName = req.body.queueName;

  try {
    const data = await sqs.createQueue({ QueueName }).promise();
    res.locals.queueUrl = data.QueueUrl;
    next();
  } catch (err) {
    console.log(err);
  }
};

export const sendMessageToQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const QueueUrl = req.body.queueUrl;
  const MessageBodyObject = req.body.messageBody;
  const title = req.body.title;
  const MessageBody = JSON.stringify(MessageBodyObject);

  try {
    const MessageId = await sqs
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
  } catch (err) {
    console.log(err);
  }
};

export const pollMessagesFromQueue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const QueueUrl = req.query.queueUrl as string;
  try {
    const messages = await sqs
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
      const messagesDeletionFuncs = res.locals.messages.map(
        (message: { ReceiptHandle: any }) => {
          return sqs.deleteMessage({
            QueueUrl,
            ReceiptHandle: message.ReceiptHandle,
          });
        }
      );

      Promise.allSettled(messagesDeletionFuncs).then((data) =>
        console.log(data)
      );
    }
  } catch (err) {
    console.log(err);
  }
};
