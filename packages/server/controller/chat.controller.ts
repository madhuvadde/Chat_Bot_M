import type { Request, Response } from 'express';
import { chatService } from '../services/chat.services';
import z from 'zod';

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(100, 'Prompt is too long(max 100 characters'),
   conversationId: z.string(), // Removed .uuid() requirement for simplicity
});

export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = chatSchema.safeParse(req.body);
      if (!parseResult.success) {
         const errors = z.treeifyError(parseResult.error);
         res.status(400).send(errors);
         return;
      }
      try {
         const { prompt, conversationId } = req.body;
         const { message } = await chatService.sendMessage(
            prompt,
            conversationId
         );
         res.send({ message });
      } catch (error) {
         res.status(500).send({ error: `Failed to generate a response.` });
      }
   },
};
