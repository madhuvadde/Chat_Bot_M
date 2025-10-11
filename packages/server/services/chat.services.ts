import { conversationRepository } from '../repositories/conversation.repository';
import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const inferenceClient = new InferenceClient(
   process.env.HUGGING_API_KEY || process.env.HF_TOKEN
);
type chatResponse = {
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<chatResponse> {
      try {
         console.log('Chat service: Processing message:', {
            prompt,
            conversationId,
         });

         // Check if API key is available
         if (!process.env.HUGGING_API_KEY && !process.env.HF_TOKEN) {
            throw new Error(
               'Hugging Face API key not found. Please set HUGGING_API_KEY environment variable.'
            );
         }

         const history: any =
            conversationRepository.getConversationHistory(conversationId);
         conversationRepository.setConversationHistory(history, {
            role: 'user',
            content: prompt,
         });
         console.log('Chat service: Calling Hugging Face API...');
         const output = await inferenceClient.chatCompletion({
            provider: 'cerebras',
            model: 'meta-llama/Llama-3.1-8B-Instruct',
            messages: history,
         });
         const assistantReply: string =
            output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
         conversationRepository.setConversationHistory(history, {
            role: 'assistant',
            content: assistantReply,
         });
         console.log('Chat service: Response generated successfully');
         return { message: assistantReply };
      } catch (error) {
         console.error('Chat service error:', error);
      }
   },
};
