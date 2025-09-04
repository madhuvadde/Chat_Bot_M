import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { llmClient } from './llm/client';
import z from 'zod';
dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send(`Hello World!! ${process.env.HUGGING_API_KEY}`);
});
app.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: `Hello World of OG!!` });
});

app.post('/api/summarize', async (req: Request, res: Response) => {
   const { text } = req.body;
   const summary = await llmClient.summarize(text);
   res.send({ summary });
});
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(100, 'Prompt is too long(max 100 characters'),
   conversationId: z.uuid(),
});
app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = chatSchema.safeParse(req.body);
   if (!parseResult.success) {
      const errors = z.treeifyError(parseResult.error);
      res.status(400).send(errors);
      return;
   }
   try {
      const { prompt, conversationId } = req.body;
      const { message } = await llmClient.generate(prompt, conversationId);
      res.send({ message });
   } catch (error) {
      res.status(500).send({ error: `Failed to generate a response.` });
   }
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
