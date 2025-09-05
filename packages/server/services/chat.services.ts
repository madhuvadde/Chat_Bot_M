import { conversationRepository } from '../repositories/conversation.repository';
import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
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
      // history.push({ role: 'user', content: text });
      const output = await inferenceClient.chatCompletion({
         provider: 'cerebras',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: history,
      });
      const assistantReply: string =
         output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
      // history.push({ role: 'assistant', content: assistantReply });
      conversationRepository.setConversationHistory(history, {
         role: 'assistant',
         content: assistantReply,
      });
      return { message: assistantReply };
   },
};
