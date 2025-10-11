import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

type ImageResponse = {
   imageUrl: string;
};

export const imageService = {
   async generateImage(prompt: string): Promise<ImageResponse> {
      try {
         const image = await inferenceClient.textToImage({
            provider: 'hf-inference',
            model: 'black-forest-labs/FLUX.1-schnell',
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
         });

         // Convert Blob to base64 data URL
         const arrayBuffer = await image.arrayBuffer();
         const base64 = Buffer.from(arrayBuffer).toString('base64');
         const imageUrl = `data:image/png;base64,${base64}`;

         return { imageUrl };
      } catch (error) {
         console.error('Error generating image:', error);
         throw new Error('Failed to generate image');
      }
   },
};
