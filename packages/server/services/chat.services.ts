import { conversationRepository } from '../repositories/conversation.repository';
import { clientProvider } from '../utils/common';
// import { InferenceClient } from '@huggingface/inference';
// import OpenAI from 'openai';
// import dotenv from 'dotenv';
// dotenv.config();

// const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
type chatResponse = {
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<chatResponse> {
      const history: any =
         conversationRepository.getConversationHistory(conversationId);
      conversationRepository.setConversationHistory(history, {
         role: 'user',
         content: prompt,
      });

      const assistantReply: any = await clientProvider.ollamaClient(history);

      conversationRepository.setConversationHistory(history, {
         role: 'assistant',
         content: assistantReply,
      });
      return { message: assistantReply };
   },
};
