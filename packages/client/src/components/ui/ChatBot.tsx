import { useState, useRef, type KeyboardEvent } from 'react';
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

const ChatBot = () => {
   const [messages, setMessages] = useState<string[]>([]);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const onSubmitHandler = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, prompt]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, data.message]);
   };

   const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); //To get rid of extra space when clicked on enter(default behaviour)
         handleSubmit(onSubmitHandler)();
      }
   };

   return (
      <div>
         <div>
            {messages.map((message, index) => (
               <p key={index}>{message}</p>
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
