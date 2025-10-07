import { llmClient } from '../llm/client';
import { reviewRepository } from '../repositories/review.repository';
import template from '../prompts/summarize-reviews.txt';

export const reviewService = {
   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary: string | null =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);
      const summary = await llmClient.summarize(prompt);
      await reviewRepository.storeReviewSummary(productId, summary);
      return summary;
   },
};
