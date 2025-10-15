import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import { Ollama } from 'ollama';
import dotenv from 'dotenv';

dotenv.config();

export const clientProvider = {
   async openAIClient(history: any) {
      const openai = new OpenAI({
         apiKey: process.env.PXTY_API_KEY,
         baseURL: 'https://api.perplexity.ai',
      });

      const output = await openai.chat.completions.create({
         model: 'sonar-pro',
         messages: history,
      });

      const assistantReply: string =
         output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
      return assistantReply;
   },

   async huggingFaceClient(history: any) {
      const inferenceClient = new InferenceClient(process.env.HF_TOKEN);
      const output = await inferenceClient.chatCompletion({
         provider: 'cerebras',
         model: 'meta-llama/Llama-3.1-8B-Instruct',
         messages: history,
      });
      const assistantReply: string =
         output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
      return assistantReply;
   },

   async ollamaClient(history: any) {
      // const ollamaClient = new Ollama();
      const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://ollama:11434';

      const ollamaClient = new OpenAI({
         baseURL: OLLAMA_BASE_URL,
         apiKey: 'ollama', // not required but SDK needs something
      });
      try {
         const output = await ollamaClient.chat.completions.create({
            model: 'gemma3:4b',
            messages: history,
         });
         const assistantReply: string =
            output?.choices[0]?.message?.content || 'Something Went Wrong!!!';
         return assistantReply;
      } catch (error) {
         console.log('Inside catch block');
         console.error(error);
      }
   },
};
