import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repository';
import { reviewRepository } from '../repositories/review.repository';

export const reviewController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         return res.status(400).json({ error: 'Product does not exist.' });
      }
      const reviews = await reviewRepository.getReviews(productId);
      const summary = await reviewRepository.getReviewSummary(productId);
      res.json({
         summary,
         reviews,
      });
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         return res.status(400).json({ error: 'Invalid product' });
      }

      const reviews = await reviewRepository.getReviews(productId, 1);
      if (!reviews.length) {
         return res
            .status(400)
            .json({ error: 'There are no reviews to summarize' });
      }
      const summary = await reviewService.summarizeReviews(productId);
      res.json({ summary });
   },
};
