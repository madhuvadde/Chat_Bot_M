import express from 'express';
import type { Request, Response } from 'express';
// import { llmClient } from './llm/client';
import { chatController } from './controller/chat.controller';
// import { reviewController } from './controller/review.controller';

const router = express.Router();

// Root route moved to main server file for environment-specific handling
// router.get('/', (req: Request, res: Response) => {
//    res.send(`Hello World!! ${process.env.HUGGING_API_KEY}`);
// });
router.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: `Hello World of OG!!` });
});

// router.post('/api/summarize', async (req: Request, res: Response) => {
//    const { text } = req.body;
//    const summary = await llmClient.summarize(text);
//    res.send({ summary });
// });

router.post('/api/chat', chatController.sendMessage);

// router.get('/api/products/:id/reviews', reviewController.getReviews);
// router.post(
//    '/api/products/:id/reviews/summarize',
//    reviewController.summarizeReviews
// );

export default router;
