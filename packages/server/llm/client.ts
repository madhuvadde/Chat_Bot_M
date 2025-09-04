import { InferenceClient } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
// messages store
const conversations = new Map<
   string | null,
   { role: string; content: string }[]
>();

export const llmClient = {
   summarize: async (text: string) => {
      const output = await inferenceClient.summarization({
         model: 'facebook/bart-large-cnn',
         inputs: text,
         provider: 'hf-inference',
      });
      return output.summary_text;
   },
   generate: async (text: string, conversationId: string | null) => {
      if (!conversations.has(conversationId)) {
         conversations.set(conversationId, [{ role: 'system', content: '' }]);
      }

      const history: any = conversations.get(conversationId);
      history.push({ role: 'user', content: text });
      const output = await inferenceClient.chatCompletion({
         provider: 'cerebras',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: history,
      });
      const assistantReply = output?.choices[0]?.message?.content;
      history.push({ role: 'assistant', content: assistantReply });
      return { message: assistantReply };
   },
};
