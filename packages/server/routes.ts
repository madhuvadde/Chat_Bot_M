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
   console.log('API /api/hello called');
   try {
      res.json({
         message: `Hello World of OG!!`,
         timestamp: new Date().toISOString(),
      });
   } catch (error) {
      console.error('Error in /api/hello:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

router.get('/api/health', (req: Request, res: Response) => {
   console.log('API /api/health called');
   try {
      const hasApiKey = !!(process.env.HUGGING_API_KEY || process.env.HF_TOKEN);
      res.json({
         status: 'ok',
         timestamp: new Date().toISOString(),
         environment: process.env.NODE_ENV,
         hasApiKey,
         port: process.env.PORT || 3000,
      });
   } catch (error) {
      console.error('Error in /api/health:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
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
