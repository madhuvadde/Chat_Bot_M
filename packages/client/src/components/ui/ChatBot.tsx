import { useState, useRef, type KeyboardEvent } from 'react';
import ReactMarkDown from 'react-markdown';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const onSubmitHandler = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
   };

   const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); //To get rid of extra space when clicked on enter(default behaviour)
         handleSubmit(onSubmitHandler)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-2 mb-10">
            {messages.map((message, index) => (
               <div
                  key={index}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black'
                  }`}
               >
                  <ReactMarkDown>{message.content}</ReactMarkDown>
               </div>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            onKeyDown={onKeyDownHandler}
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               maxLength={100}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
