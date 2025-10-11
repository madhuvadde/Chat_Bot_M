import type { Request, Response } from 'express';
import { imageService } from '../services/image.service';
import z from 'zod';

const imageSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(200, 'Prompt is too long(max 200 characters)'),
});

export const imageController = {
   async generateImage(req: Request, res: Response) {
      const parseResult = imageSchema.safeParse(req.body);
      if (!parseResult.success) {
         const errors = z.treeifyError(parseResult.error);
         res.status(400).send(errors);
         return;
      }
      try {
         const { prompt } = req.body;
         const { imageUrl } = await imageService.generateImage(prompt);
         res.send({ imageUrl });
      } catch (error) {
         res.status(500).send({ error: 'Failed to generate image.' });
      }
   },
};
