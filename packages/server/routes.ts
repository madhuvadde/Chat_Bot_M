import express from 'express';
import type { Request, Response } from 'express';
import { llmClient } from './llm/client';
import { chatController } from './controller/chat.controller';
import { reviewController } from './controller/review.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send(`Hello World!! ${process.env.HUGGING_API_KEY}`);
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: `Hello World of OG!!` });
});

router.post('/api/summarize', async (req: Request, res: Response) => {
   const { text } = req.body;
   const summary = await llmClient.summarize(text);
   res.send({ summary });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);

export default router;
