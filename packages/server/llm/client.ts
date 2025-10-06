// import { conversationRepository } from '../repositories/conversation.repository';
import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

export const llmClient = {
   summarize: async (text: string) => {
      const output = await inferenceClient.summarization({
         // model: 'facebook/bart-large-cnn',
         // model: 'google/pegasus-xsum',
         model: 'sshleifer/distilbart-cnn-12-6',
         inputs: `Summarize the following customer reviews into a short paragraph of 4 to 5 lines highlighting
         key themes, both positive and negative: 
         ${text}`,
         provider: 'hf-inference',
      });
      return output.summary_text;
   },
   // generate: async (text: string, conversationId: string | null) => {
   //    const history: any =
   //       conversationRepository.getConversationHistory(conversationId);
   //    conversationRepository.setConversationHistory(history, {
   //       role: 'user',
   //       content: text,
   //    });
   //    // history.push({ role: 'user', content: text });
   //    const output = await inferenceClient.chatCompletion({
   //       provider: 'cerebras',
   //       model: 'meta-llama/Llama-3.1-8B-Instruct',
   //       messages: history,
   //    });
   //    const assistantReply: string =
   //       output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
   //    // history.push({ role: 'assistant', content: assistantReply });
   //    conversationRepository.setConversationHistory(history, {
   //       role: 'assistant',
   //       content: assistantReply,
   //    });
   //    return { message: assistantReply };
   // },
};
