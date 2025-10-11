import {
   useState,
   useRef,
   useEffect,
   type KeyboardEvent,
   type ClipboardEvent,
} from 'react';
import ReactMarkDown from 'react-markdown';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa6';
import { FaImage } from 'react-icons/fa6';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type ImageResponse = {
   imageUrl: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
   type?: 'text' | 'image';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [isGeneratingImage, setIsGeneratingImage] = useState(false);
   const [error, setError] = useState('');
   const conversationId = useRef(crypto.randomUUID());
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const onSubmitHandler = async ({ prompt }: FormData) => {
      try {
         setIsBotTyping(true);
         setError('');
         setMessages((prev) => [
            ...prev,
            { content: prompt, role: 'user', type: 'text' },
         ]);
         reset({ prompt: '' });
         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot', type: 'text' },
         ]);
      } catch (error) {
         console.error(error);
         setError('Something went wrong, try again!');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onGenerateImageHandler = async ({ prompt }: FormData) => {
      try {
         setIsGeneratingImage(true);
         setError('');
         setMessages((prev) => [
            ...prev,
            { content: prompt, role: 'user', type: 'text' },
         ]);
         reset({ prompt: '' });
         const { data } = await axios.post<ImageResponse>(
            '/api/generate-image',
            {
               prompt,
            }
         );
         setMessages((prev) => [
            ...prev,
            { content: data.imageUrl, role: 'bot', type: 'image' },
         ]);
      } catch (error) {
         console.error(error);
         setError('Failed to generate image, try again!');
      } finally {
         setIsGeneratingImage(false);
      }
   };

   const onKeyDownHandler = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); //To get rid of extra space when clicked on enter(default behaviour)
         handleSubmit(onSubmitHandler)();
      }
   };

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessageHandler = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-2 mb-10 overflow-y-auto">
            {messages.map((message, index) => (
               <div
                  key={index}
                  onCopy={onCopyMessageHandler}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-100 text-black self-start'
                  }`}
               >
                  {message.type === 'image' ? (
                     <img
                        src={message.content}
                        alt="Generated"
                        className="w-2xl h-auto rounded-lg"
                     />
                  ) : (
                     <ReactMarkDown>{message.content}</ReactMarkDown>
                  )}
               </div>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
            {isGeneratingImage && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-full">
                  <span className="text-sm text-gray-700">
                     Generating image...
                  </span>
               </div>
            )}
            {error && <p className="text-red-600">{error}</p>}
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
               autoFocus
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything"
               maxLength={100}
            />
            <div className="flex gap-2">
               <Button
                  type="button"
                  disabled={!formState.isValid || isGeneratingImage}
                  onClick={handleSubmit(onGenerateImageHandler)}
                  className="rounded-full w-9 h-9"
               >
                  <FaImage />
               </Button>
               <Button
                  disabled={!formState.isValid || isBotTyping}
                  className="rounded-full w-9 h-9"
               >
                  <FaArrowUp />
               </Button>
            </div>
         </form>
      </div>
   );
};

export default ChatBot;
