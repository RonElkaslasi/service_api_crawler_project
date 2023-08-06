import express from "express";
import { createQueue, sendMessageToQueue } from "../middleware/sqs";

const router = express.Router();

router.post("/create-queue", createQueue, async (req, res) => {
  res.send({ queueUrl: res.locals.queueUrl });
});

router.post("/scrape-jobs", sendMessageToQueue, async (req, res) => {
  res.send({ messageId: res.locals.messageId });
});

export default router;
